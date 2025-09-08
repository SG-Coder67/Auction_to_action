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
    session.startTransaction();
    try {
        const { teamOne, teamTwo } = req.body;
        const teamA = await Team.findOne({ teamNumber: teamOne.teamNumber }).session(session);
        const teamB = await Team.findOne({ teamNumber: teamTwo.teamNumber }).session(session);
        // ... validation ...
        
        const teamA_itemsToSend = teamOne.itemsToSend || [];
        const teamA_moneyToSend = Number(teamOne.moneyToSend) || 0;
        const teamB_itemsToSend = teamTwo.itemsToSend || [];
        const teamB_moneyToSend = Number(teamTwo.moneyToSend) || 0;

        // Update money and inventory for both teams...
        teamA.debit += teamA_moneyToSend;
        teamB.credit += teamA_moneyToSend;
        teamB.debit += teamB_moneyToSend;
        teamA.credit += teamB_moneyToSend;
        if(teamA_itemsToSend.length > 0) teamA.inventory.pull(...teamA_itemsToSend);
        if(teamB_itemsToSend.length > 0) teamB.inventory.pull(...teamB_itemsToSend);
        if(teamB_itemsToSend.length > 0) teamA.inventory.push(...teamB_itemsToSend);
        if(teamA_itemsToSend.length > 0) teamB.inventory.push(...teamA_itemsToSend);
        
        await teamA.save({ session });
        await teamB.save({ session });

        const newTrade = new Trade({ /* ... create detailed trade document ... */ });
        await newTrade.save({ session });
        
        await session.commitTransaction();

        // Broadcast updates to specific team rooms
        req.io.to(`team-${teamA.teamNumber}`).emit('team_updated', teamA);
        req.io.to(`team-${teamB.teamNumber}`).emit('team_updated', teamB);
        req.io.emit('new_trade', newTrade); // Broadcast to everyone for live feed

        res.status(200).json({ message: 'Trade executed successfully.', tradeDetails: newTrade });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Server error during trade.', error: error.message });
    } finally {
        session.endSession();
    }
};

// --- HISTORY / GETTERS ---
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort({ timestamp: -1 }).populate('teamId', 'teamNumber').populate('itemId', 'name');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching transaction history.' });
    }
};

exports.getTradeHistory = async (req, res) => {
    try {
        const trades = await Trade.find({}).sort({ timestamp: -1 }).populate('teamOne.itemsSent teamTwo.itemsSent', 'name');
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching trade history.' });
    }
};