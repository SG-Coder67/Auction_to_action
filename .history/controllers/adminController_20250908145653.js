const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const AdminUser = require('../models/AdminUser');
const Trade = require('../models/Trade');
const Round = require('../models/Round');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// --- ADMIN MANAGEMENT (CRUD) ---
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.find({}).select('-password');
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching admins.' });
  }
};

exports.addAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new AdminUser({ username, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating admin.' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const updateData = {};
    if (username) updateData.username = username;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const admin = await AdminUser.findByIdAndUpdate(id, updateData, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    res.status(200).json({ message: 'Admin updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating admin.' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await AdminUser.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });
    res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting admin.' });
  }
};

// --- TEAM MANAGEMENT (CRUD) ---
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).sort({ teamNumber: 1 }).populate('inventory', 'name');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching teams.' });
    }
};

exports.addTeam = async (req, res) => {
    try {
        const { teamNumber, teamCredential, credit } = req.body;
        const existingTeam = await Team.findOne({ teamNumber });
        if (existingTeam) {
            return res.status(400).json({ message: `Team #${teamNumber} already exists.`});
        }
        const newTeam = new Team({ teamNumber, teamCredential, credit: credit || 20000 });
        await newTeam.save();
        res.status(201).json({ message: 'Team created successfully', team: newTeam });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating team.', error: error.message });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { teamCredential, credit, debit } = req.body;
        const team = await Team.findByIdAndUpdate(id, { teamCredential, credit, debit }, { new: true });
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ message: 'Team updated successfully', team });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating team.', error: error.message });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findByIdAndDelete(id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ message: 'Team deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting team.', error: error.message });
    }
};

// --- GAME STATE & EVENT LOGIC ---
exports.updateRound = async (req, res) => {
  try {
    const { roundNumber, roundStatus } = req.body;
    let round = await Round.findOne().sort({ createdAt: -1 });
    if (round) {
      round.roundNumber = roundNumber;
      round.roundStatus = roundStatus;
    } else {
      round = new Round({ roundNumber, roundStatus });
    }
    await round.save();
    
    req.io.emit('round_updated', round);
    console.log('📡 Round status updated and broadcasted:', round);
    res.status(200).json(round);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating round', error: error.message });
  }
};

exports.getCurrentRound = async (req, res) => {
    try {
        const round = await Round.findOne().sort({ createdAt: -1 });
        if (!round) {
          return res.status(404).json({ message: "No round has been started yet." });
        }
        res.status(200).json(round);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching round status' });
    }
};

exports.updateTeamGeneric = async (req, res) => {
  try {
    const { teamNumber, creditChange = 0, debitChange = 0, addItem = null, removeItem = null, broadcastScope = 'all' } = req.body;
    const updateOps = {};
    if (creditChange) updateOps.$inc = { credit: Number(creditChange) };
    if (debitChange) updateOps.$inc = { debit: Number(debitChange) };
    if (addItem) updateOps.$push = { inventory: addItem };
    if (removeItem) updateOps.$pull = { inventory: removeItem };
    await Team.updateOne({ teamNumber }, updateOps);
    const updatedTeam = await Team.findOne({ teamNumber });
    if (updatedTeam) {
      if (broadcastScope === 'team') {
        req.io.to(`team-${teamNumber}`).emit('team_updated', updatedTeam);
      } else {
        req.io.emit('team_updated', updatedTeam);
      }
      console.log(`📡 Team ${teamNumber} updated and broadcasted.`);
    }
    res.json({ success: true, team: updatedTeam });
  } catch (err) {
    console.error('Error in updateTeamGeneric:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price, round } = req.body;
    const team = await Team.findOne({ teamNumber });
    const item = await Item.findById(itemId);
    if (!team || !item) return res.status(404).json({ message: 'Team or Item not found.' });
    
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
        if (!teamA || !teamB) throw new Error('One or both teams not found.');
        
        const teamA_itemsToSend = teamOne.itemsToSend || [];
        const teamA_moneyToSend = Number(teamOne.moneyToSend) || 0;
        const teamB_itemsToSend = teamTwo.itemsToSend || [];
        const teamB_moneyToSend = Number(teamTwo.moneyToSend) || 0;

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

        const newTrade = new Trade({
            teamOne: { teamId: teamA._id, teamNumber: teamA.teamNumber, itemsSent: teamA_itemsToSend, moneySent: teamA_moneyToSend },
            teamTwo: { teamId: teamB._id, teamNumber: teamB.teamNumber, itemsSent: teamB_itemsToSend, moneySent: teamB_moneyToSend }
        });
        await newTrade.save({ session });
        
        await session.commitTransaction();

        req.io.to(`team-${teamA.teamNumber}`).emit('team_updated', await Team.findById(teamA._id));
        req.io.to(`team-${teamB.teamNumber}`).emit('team_updated', await Team.findById(teamB._id));
        req.io.emit('new_trade', newTrade);

        res.status(200).json({ message: 'Trade executed successfully.', tradeDetails: newTrade });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Server error during trade.', error: error.message });
    } finally {
        session.endSession();
    }
};

// --- HISTORY GETTERS ---
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