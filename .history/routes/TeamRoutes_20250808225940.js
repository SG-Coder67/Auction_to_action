const expressTeam = require('express');
const bcryptTeam = require('bcryptjs');
const jwtTeam = require('jsonwebtoken');
const Team = require('../models/Team');

const teamRouter = expressTeam.Router();

teamRouter.post('/register', async (req, res) => {
    try {
        const { registerNumber, password, teamName } = req.body;

        const registerNumberRegex = /^(23|24|25)[A-Z]{3}[0-9]{4}$/;
        if (!registerNumberRegex.test(registerNumber)) {
            return res.status(400).json({ message: 'Invalid register number format. Example: 23BCE2007' });
        }
        // --- END OF NEW LOGIC ---

        const existingTeam = await Team.findOne({ 'teamLeader.registerNumber': registerNumber });
        if (existingTeam) return res.status(400).json({ message: 'A team with this leader register number already exists.' });

        const hashedPassword = await bcryptTeam.hash(password, 10);
        
        const newTeam = new Team({ 
            teamName, 
            teamLeader: {
                registerNumber,
                password: hashedPassword
            },
            members: [registerNumber]
        });
        
        await newTeam.save();

        res.status(201).json({ message: 'Team created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

teamRouter.post('/login', async (req, res) => {
    try {
        const { registerNumber, password } = req.body;
        const team = await Team.findOne({ 'teamLeader.registerNumber': registerNumber });

        if (team && (await bcryptTeam.compare(password, team.teamLeader.password))) {
            const token = jwtTeam.sign({ teamId: team._id, role: 'participant' }, process.env.PARTICIPANT_JWT_SECRET, { expiresIn: '8h' });
            res.json({ message: 'Login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid register number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const protectTeam = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwtTeam.verify(token, process.env.PARTICIPANT_JWT_SECRET);
        if (decoded.role !== 'participant') return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

teamRouter.get('/dashboard', protectTeam, async (req, res) => {
    try {
        const team = await Team.findById(req.user.teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        
        const dashboardData = {
            message: `Welcome, Team ${team.teamName}!`,
            teamId: team._id,
            budget: team.budget,
            leaderRegisterNumber: team.teamLeader.registerNumber,
            members: team.members
        };
        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

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
