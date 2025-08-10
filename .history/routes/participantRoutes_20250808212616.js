const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ParticipantUser = require('../models/ParticipantUser');
const Team = require('../models/Team');

const participantRouter = express.Router();

// Endpoint for a Team Leader to register themselves and create their team
participantRouter.post('/register-leader', async (req, res) => {
    try {
        const { registerNumber, password, teamName, maxSize } = req.body;

        if (![3, 4, 5].includes(maxSize)) {
            return res.status(400).json({ message: 'Team size must be 3, 4, or 5.' });
        }

        const existingUser = await ParticipantUser.findOne({ registerNumber });
        if (existingUser) return res.status(400).json({ message: 'A user with this register number already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const leader = new ParticipantUser({ registerNumber, password: hashedPassword });
        
        const newTeam = new Team({ teamName, teamLeader: leader._id, maxSize, members: [leader._id] });
        
        leader.team = newTeam._id;

        await leader.save();
        await newTeam.save();

        res.status(201).json({ 
            message: 'Team and Leader created successfully.',
            teamCode: newTeam.teamCode // Return the code for the leader to share
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// NEW Endpoint for Team Members to join a team
participantRouter.post('/join-team', async (req, res) => {
    try {
        const { registerNumber, password, teamCode } = req.body;

        const team = await Team.findOne({ teamCode });
        if (!team) return res.status(404).json({ message: 'Team with this code not found.' });

        if (team.members.length >= team.maxSize) {
            return res.status(400).json({ message: 'This team is already full.' });
        }

        const existingUser = await ParticipantUser.findOne({ registerNumber });
        if (existingUser) return res.status(400).json({ message: 'A user with this register number already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const member = new ParticipantUser({ registerNumber, password: hashedPassword, team: team._id });
        await member.save();

        team.members.push(member._id);
        await team.save();

        res.status(201).json({ message: 'Successfully joined the team!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Endpoint for ANY Participant (Leader or Member) to log in
participantRouter.post('/login', async (req, res) => {
    try {
        const { registerNumber, password } = req.body;
        const user = await ParticipantUser.findOne({ registerNumber });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user._id, teamId: user.team, role: 'participant' }, process.env.PARTICIPANT_JWT_SECRET, { expiresIn: '8h' });
            res.json({ message: 'Participant login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid register number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Security guard for participant routes
const protectParticipant = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.PARTICIPANT_JWT_SECRET);
        if (decoded.role !== 'participant') return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

// Protected endpoint for the Participant's Team Dashboard
participantRouter.get('/dashboard', protectParticipant, async (req, res) => {
    try {
        const team = await Team.findById(req.user.teamId).populate('teamLeader', 'registerNumber').populate('members', 'registerNumber');
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        const dashboardData = {
            message: `Welcome, Team ${team.teamName}!`,
            teamId: team._id,
            budget: team.budget,
            leaderRegisterNumber: team.teamLeader.registerNumber,
            memberRegisterNumbers: team.members.map(m => m.registerNumber)
        };
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = participantRouter;

