const Team = require('../models/Team');
const Item = require('../models/Item'); // --- NEW ---
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Handles Team Login (no changes needed here)
exports.loginTeam = async (req, res) => {
  // ... same as before
};

// Gets all dashboard data for the logged-in team
exports.getDashboardData = async (req, res) => {
  try {
    const team = await Team.findById(req.user.teamId).populate('inventory');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // --- MODIFIED: Send credit, debit, and balance ---
    res.json({
      teamNumber: team.teamNumber,
      credit: team.credit,
      debit: team.debit,
      balance: team.balance, // Send the calculated balance
      inventory: team.inventory,
      isActive: team.isActive
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- NEW: Get a list of all available items for teams to see ---
exports.getAvailableItems = async (req, res) => {
    try {
        const items = await Item.find({});
        // For teams, we don't show who owns what, just the list of items.
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching items.' });
    }
};

// Gets transaction history for the logged-in team (no changes needed)
exports.getTransactionHistory = async (req, res) => {
    // ... same as before
};