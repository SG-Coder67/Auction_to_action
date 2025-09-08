const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const AdminUser = require('../models/AdminUser');
const Trade = require('../models/Trade');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// --- ADMIN MANAGEMENT (CRUD) ---
exports.getAllAdmins = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.addAdmin = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.updateAdmin = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.deleteAdmin = async (req, res) => { /* ... (code from previous answer) ... */ };

// --- TEAM MANAGEMENT (CRUD) ---
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).sort({ teamNumber: 1 }).populate('inventory', 'name');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching teams.' });
    }
};
exports.addTeam = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.updateTeam = async (req, res) => { /* ... (code from previous answer) ... */ };
exports.deleteTeam = async (req, res) => { /* ... (code from previous answer) ... */ };

// --- GAME LOGIC ---
exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price, round } = req.body;
    const team = await Team.findOne({ teamNumber });
    const item = await Item.findById(itemId);
    // ... validation ...
    if (team.balance < price) {
        return res.status(400).json({ message: `Team's balance of ${team.balance} is too low.` });
    }
    team.debit += Number(price);
    team.inventory.push(itemId);
    await team.save();
    item.highestBidAmount = price;
    await item.save();

    const newTransaction = new Transaction({ type: 'Bid', teamId: team._id, itemId: item._id, amount: price, round, notes: `Team #${teamNumber} won ${item.name}` });
    await newTransaction.save();
    
    // Broadcast real-time update
    const bidData = { teamNumber: team.teamNumber, itemName: item.name, price };
    req.io.emit('new_bid', bidData);
    
    res.status(200).json({ message: 'Bid awarded successfully', updatedBalance: team.balance });
  } catch (error) {
    console.error("Error in awardBid:", error);
    res.status(500).json({ message: 'Server error while awarding bid.' });
  }
};

exports.executeTrade = async (req, res) => {
    const session = await mongoose.startSession();
    session