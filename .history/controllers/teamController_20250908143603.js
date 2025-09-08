const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Trade = require('../models/Trade');
const jwt = require('jsonwebtoken');

// --- AUTHENTICATION ---
exports.loginTeam = async (req, res) => {
  try {
    const { teamNumber, teamCredential } = req.body;
    const team = await Team.findOne({ teamNumber, teamCredential });

    if (!team) {
      return res.status(401).json({ message: 'Invalid Team Number or Credential.' });
    }
    
    team.isActive = true;
    await team.save();

    const token = jwt.sign(
      { teamId: team._id, teamNumber: team.teamNumber, role: 'participant' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error("Error during team login:", error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// --- DASHBOARD DATA ---
exports.getDashboardData = async (req, res) => {
  try {
    const team = await Team.findById(req.user.teamId).populate('inventory');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


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
        const bids = await Transaction.find({ type: 'Bid' }).populate('teamId', 'teamNumber').populate('itemId', 'name').select('-amount');
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching bids.' });
    }
};

exports.getPublicTradeHistory = async (req, res) => {
    try {
        const trades = await Trade.find({}).sort({ timestamp: -1 }).populate('teamOne.itemsSent teamTwo.itemsSent', 'name');
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching trade history.' });
    }
};