const Admin = require('../models/Admin');
const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const Round = require('../models/Round');
const mongoose = require('mongoose');

// --- ADMIN MANAGEMENT ---
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findOne({ adminId: req.params.adminId }).select('-password');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- TEAM MANAGEMENT ---
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).sort({ teamCode: 1 });
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateTeamBalance = async (req, res) => {
    try {
        const { teamCode } = req.params;
        const { newBalance } = req.body;
        const team = await Team.findOneAndUpdate({ teamCode }, { balance: newBalance }, { new: true });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        // Broadcast the update to all clients
        req.io.emit('team_updated', team);
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- GAME STATE & EVENTS ---
exports.updateRound = async (req, res) => {
    try {
        const { roundNumber, roundStatus } = req.body;
        let round = await Round.findOneAndUpdate({}, { roundNumber, roundStatus }, { new: true, upsert: true });
        
        // Broadcast the round update to all clients
        req.io.emit('round_updated', round);
        res.status(200).json(round);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.awardBid = async (req, res) => {
    try {
        const { teamCode, itemCode } = req.body;
        
        const item = await Item.findOne({ itemCode });
        const team = await Team.findOne({ teamCode });

        if (!item || !team) return res.status(404).json({ message: 'Team or Item not found.' });
        if (team.balance < item.basePrice) return res.status(400).json({ message: 'Insufficient balance.' });

        // Update team's balance and inventory
        team.balance -= item.basePrice;
        team.usedAmount += item.basePrice;
        team.inventory.push(itemCode);
        await team.save();

        // Create a transaction log for the bid
        const transaction = new Transaction({
            type: 'BID_WON',
            details: {
                teamCode: team.teamCode,
                teamName: team.teamName,
                itemCode: item.itemCode,
                itemName: item.name,
                amount: item.basePrice,
                round: item.round
            }
        });
        await transaction.save();

        // Broadcast updates via Socket.IO
        req.io.emit('team_updated', team); // Update everyone on the team's new status
        req.io.emit('new_event', transaction); // Send the event to the live feed

        res.status(200).json({ message: 'Bid awarded successfully', team });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.executeTrade = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { fromTeamCode, toTeamCode, fromTeamItems, fromTeamMoney, toTeamItems, toTeamMoney } = req.body;

        const teamA = await Team.findOne({ teamCode: fromTeamCode }).session(session);
        const teamB = await Team.findOne({ teamCode: toTeamCode }).session(session);
        if (!teamA || !teamB) throw new Error('One or both teams not found.');

        // Validate the trade...
        
        // Update balances
        teamA.balance = teamA.balance - fromTeamMoney + toTeamMoney;
        teamB.balance = teamB.balance - toTeamMoney + fromTeamMoney;

        // Update inventories
        if (fromTeamItems && fromTeamItems.length) {
            teamA.inventory = teamA.inventory.filter(item => !fromTeamItems.includes(item));
            teamB.inventory.push(...fromTeamItems);
        }
        if (toTeamItems && toTeamItems.length) {
            teamB.inventory = teamB.inventory.filter(item => !toTeamItems.includes(item));
            teamA.inventory.push(...toTeamItems);
        }

        await teamA.save({ session });
        await teamB.save({ session });

        // Create a transaction log for the trade
        const transaction = new Transaction({
            type: 'TRADE',
            details: { ...req.body }
        });
        await transaction.save({ session });
        
        await session.commitTransaction();

        // Broadcast updates
        req.io.emit('team_updated', teamA);
        req.io.emit('team_updated', teamB);
        req.io.emit('new_event', transaction);

        res.status(200).json({ message: 'Trade successful', teams: [teamA, teamB] });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Server Error', error: error.message });
    } finally {
        session.endSession();
    }
};

// --- HISTORY & DATA GETTERS ---
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const history = await Transaction.find({}).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};