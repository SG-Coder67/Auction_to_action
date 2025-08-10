const expressTeam = require('express');
const bcryptTeam = require('bcryptjs');
const jwtTeam = require('jsonwebtoken');
const Team = require('../models/Team');

const teamRouter = expressTeam.Router();

// Function to get the next sequential team number
async function getNextTeamNumber() {
    const lastTeam = await Team.findOne().sort({ teamNumber: -1 });
    if (lastTeam) {
        return lastTeam.teamNumber + 1;
    }
    return 1; // Start with 1 if no teams exist
}

teamRouter.post('/register', async (req, res) => {
    try {
        const { registerNumber, password, teamName } = req.body;

        const existingTeam = await Team.findOne({ 'teamLeader.registerNumber': registerNumber });
        if (existingTeam) return res.status(400).json({ message: 'A team with this leader register number already exists.' });

        const hashedPassword = await bcryptTeam.hash(password, 10);
        const teamNumber = await getNextTeamNumber();

        // Default constructions that every team can see
        const defaultConstructions = [
            { name: 'Community Garden', price: 5000, requirements: ['Seeds', 'Tools', 'Fertilizer'] },
            { name: 'Clean Water Station', price: 8000, requirements: ['Filter', 'Pump', 'Storage Tank'] }
        ];
        
        const newTeam = new Team({ 
            teamName, 
            teamNumber,
            teamLeader: {
                registerNumber,
                password: hashedPassword
            },
            members: [registerNumber],
            constructions: defaultConstructions
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
            teamNumber: team.teamNumber, // Send the team number
            budget: team.budget,
            leaderRegisterNumber: team.teamLeader.registerNumber,
            members: team.members,
            availableConstructions: team.constructions // Send the construction info
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

