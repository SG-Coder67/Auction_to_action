const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../models/Team');
const ParticipantUser = require('../models/ParticipantUser'); // Import the user model

const teamRouter = express.Router();

// Function to get the next sequential team number
async function getNextTeamNumber() {
    const lastTeam = await Team.findOne().sort({ teamNumber: -1 });
    if (lastTeam) {
        return lastTeam.teamNumber + 1;
    }
    return 1; // Start with 1 if no teams exist
}

// Endpoint for a Team Leader to register their team and their own user account
teamRouter.post('/register', async (req, res) => {
    try {
        const { registerNumber, password, teamName } = req.body;

        // Check if a user with this register number already exists
        const existingUser = await ParticipantUser.findOne({ registerNumber });
        if (existingUser) return res.status(400).json({ message: 'A user with this register number already exists.' });

        // Hash the leader's password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the new leader user
        const leader = new ParticipantUser({
            registerNumber,
            password: hashedPassword
        });
        
        const teamNumber = await getNextTeamNumber();
        const defaultConstructions = [
            { name: 'Community Garden', price: 5000, requirements: ['Seeds', 'Tools', 'Fertilizer'] },
            { name: 'Clean Water Station', price: 8000, requirements: ['Filter', 'Pump', 'Storage Tank'] }
        ];

        // Create the new team and set the leader
        const newTeam = new Team({ 
            teamName, 
            teamNumber,
            teamLeader: leader._id, // Link to the new leader user
            members: [registerNumber], // Add leader's reg no as the first member
            constructions: defaultConstructions
        });
        
        // Link the team back to the leader user
        leader.team = newTeam._id;

        // Save both documents to the database
        await leader.save();
        await newTeam.save();

        res.status(201).json({ message: 'Team and Leader created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Endpoint for a Team Leader to log in
teamRouter.post('/login', async (req, res) => {
    try {
        const { registerNumber, password } = req.body;
        
        // Find the USER by their register number
        const user = await ParticipantUser.findOne({ registerNumber });

        // Check if the user exists and the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            // Create a token containing the user's ID and team ID
            const token = jwt.sign({ userId: user._id, teamId: user.team, role: 'participant' }, process.env.PARTICIPANT_JWT_SECRET, { expiresIn: '8h' });
            res.json({ message: 'Login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid register number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Security guard for team routes
const protectTeam = (req, res, next) => {
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

// Protected endpoint for the Team's Dashboard
teamRouter.get('/dashboard', protectTeam, async (req, res) => {
    try {
        // Find the team using the teamId from the JWT
        const team = await Team.findById(req.user.teamId).populate('teamLeader', 'registerNumber');
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        const dashboardData = {
            message: `Welcome, Team ${team.teamName}!`,
            teamId: team._id,
            teamNumber: team.teamNumber,
            budget: team.budget,
            leaderRegisterNumber: team.teamLeader.registerNumber,
            members: team.members,
            availableConstructions: team.constructions
        };
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to add team member names
teamRouter.post('/add-member', protectTeam, async (req, res) => {
    try {
        const { memberName } = req.body;
        const team = await Team.findById(req.user.teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        team.members.push(memberName);
        await team.save();

        res.status(200).json({ message: 'Member added successfully', members: team.members });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = teamRouter;