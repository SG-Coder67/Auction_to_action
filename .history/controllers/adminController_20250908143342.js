const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const AdminUser = require('../models/AdminUser');
const Trade = require('../models/Trade');
const Round = require('../models/Round');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// --- ADMIN MANAGEMENT (CRUD) ---
exports.getAllAdmins = async (req, res) => { /* ... code is correct ... */ };
exports.addAdmin = async (req, res) => { /* ... code is correct ... */ };
exports.updateAdmin = async (req, res) => { /* ... code is correct ... */ };
exports.deleteAdmin = async (req, res) => { /* ... code is correct ... */ };

// --- TEAM MANAGEMENT (CRUD) ---
exports.getAllTeams = async (req, res) => { /* ... code is correct ... */ };
exports.addTeam = async (req, res) => { /* ... code is correct ... */ };
exports.updateTeam = async (req, res) => { /* ... code is correct ... */ };
exports.deleteTeam = async (req, res) => { /* ... code is correct ... */ };


// --- GAME STATE & EVENT LOGIC ---

// --- Merged from teammate's index.js ---
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
    
    // Broadcast the update to all clients
    req.io.emit('round_updated', round);
    console.log('📡 Round status updated and broadcasted:', round);
    res.status(200).json(round);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating round', error: error.message });
  }
};

exports.getCurrentRound = async (req, res) => { /* ... code is correct ... */ };

// --- Merged from teammate's index.js ---
// This is a powerful function for making small, targeted updates to a team.
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
  // ... your full awardBid logic is correct ...
  // Make sure it includes the broadcast line:
  // req.io.emit('new_bid', { teamNumber, itemName, price });
};

exports.executeTrade = async (req, res) => {
  // ... your full executeTrade logic is correct ...
  // Make sure it includes the broadcast lines:
  // req.io.to(`team-${teamA.teamNumber}`).emit('team_updated', teamA);
  // req.io.to(`team-${teamB.teamNumber}`).emit('team_updated', teamB);
  // req.io.emit('new_trade', newTrade);
};


// --- HISTORY GETTERS ---
exports.getTransactionHistory = async (req, res) => { /* ... code is correct ... */ };
exports.getTradeHistory = async (req, res) => { /* ... code is correct ... */ };