const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// loginTeam function remains the same...
exports.loginTeam = async (req, res) => { /* ... same as before ... */ };

// Gets dashboard data, matching the StatCards in DashboardContent.jsx
exports.getDashboardData = async (req, res) => {
  try {
    const team = await Team.findById(req.user.teamId).populate('inventory');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // --- MODIFIED: Sends the exact data needed by the frontend ---
    res.json({
      teamNumber: team.teamNumber,
      credit: team.credit,
      debit: team.debit,
      balance: team.balance, // The calculated virtual property
      inventory: team.inventory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Gets transaction history for the logged-in team (for "My Bids" page)
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ teamId: req.user.teamId })
          .populate("itemId", "name")
          .sort({ timestamp: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a list of all items for the "Available Materials" table
exports.getAvailableItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching items.' });
    }
};

// --- NEW: Gets all bids for the "Team Bid History" page ---
// Does not show bid amounts to other teams.
exports.getAllTeamBids = async (req, res) => {
    try {
        const bids = await Transaction.find({ type: 'Bid' })
            .populate('teamId', 'teamNumber')
            .populate('itemId', 'name description')
            .select('-amount') // --- SECURITY: Hides the bid amount from other teams ---
            .sort({ timestamp: -1 });
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching all bids.' });
    }
};