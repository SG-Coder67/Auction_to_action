const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Trade = require('../models/Trade');
const jwt = require('jsonwebtoken');

// --- AUTHENTICATION ---
exports.loginTeam = async (req, res) => { /* ... (code from previous answer) ... */ };

// --- DASHBOARD DATA ---
exports.getDashboardData = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.getAvailableItems = async (req, res) => { /* ... (code from previous answer) ... */ };

// --- HISTORY FOR TEAM VIEW ---
exports.getMyTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ teamId: req.user.teamId }).sort({ timestamp: -1 }).populate('itemId', 'name description');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching history.' });
    }
};

exports.getPublicBidHistory = async (req, res) => {
    try {
        const bids = await Transaction.find({