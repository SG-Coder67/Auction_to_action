const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Team Login (You'll need an Auth Controller for Admin, but this is fine for teams)
exports.loginTeam = async (req, res) => {
    try {
        const { teamCode, password } = req.body;
        const team = await Team.findOne({ teamCode });
        if (!team || team.password !== password) { // Note: In production, use bcrypt for passwords!
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ teamId: team._id, teamCode: team.teamCode }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ message: 'Login successful', token, team });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get the logged-in team's data
exports.getMyTeamData = async (req, res) => {
    try {
        const team = await Team.findOne({ teamCode: req.user.teamCode });
        if (!team) return res.status(404).json({ message: 'Team not found' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all items available in the auction
exports.getAvailableItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get the public transaction history
exports.getPublicHistory = async (req, res) => {
    try {
        const history = await Transaction.find({}).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};