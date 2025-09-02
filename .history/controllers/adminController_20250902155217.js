const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const AdminUser = require('../models/AdminUser'); // --- NEW ---
const bcrypt = require('bcryptjs'); // --- NEW ---

// --- ADMIN MANAGEMENT (CRUD) ---

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching admins.' });
  }
};

// Add a new admin
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

// Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const admin = await AdminUser.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    if (username) admin.username = username;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();
    res.status(200).json({ message: 'Admin updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating admin.' });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await AdminUser.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }
    res.status(200).json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting admin.' });
  }
};


// --- TEAM MANAGEMENT ---

// Get all teams data for admin dashboard
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).populate('inventory');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching teams.' });
    }
};


// --- GAME LOGIC ---

/**
 * Awards a won item to a team after a bid.
 * Expects { teamNumber, itemId, price, round } in the request body.
 */
exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price, round } = req.body; // --- MODIFIED: Added 'round' ---

    if (!teamNumber || !itemId || price == null || !round) {
      return res.status(400).json({ message: 'Missing teamNumber, itemId, price, or round.' });
    }

    const team = await Team.findOne({ teamNumber: teamNumber });
    const item = await Item.findById(itemId);

    if (!team) return res.status(404).json({ message: `Team #${teamNumber} not found.` });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    
    // --- MODIFIED: Check against calculated balance ---
    if (team.balance < price) {
      return res.status(400).json({ message: `Team #${teamNumber}'s balance of ${team.balance} is too low.` });
    }

    // --- MODIFIED: Update debit and inventory ---
    team.debit += price;
    team.inventory.push(itemId);
    await team.save();
    
    // --- MODIFIED: Update item's highest bid ---
    item.highestBidAmount = price;
    await item.save();

    const newTransaction = new Transaction({
      type: 'Bid',
      teamId: team._id,
      itemId: item._id,
      amount: price,
      round: round, // --- MODIFIED: Save the round number ---
      notes: `Team #${teamNumber} won ${item.name} for ${price} in round ${round}`
    });
    await newTransaction.save();
    
    res.status(200).json({
      message: `Successfully awarded '${item.name}' to Team #${teamNumber}.`,
      updatedBalance: team.balance // --- MODIFIED: Send back new balance ---
    });

  } catch (error) {
    console.error("Error in awardBid:", error);
    res.status(500).json({ message: 'Server error while awarding bid.', error: error.message });
  }
};


/**
 * --- NEW: ROUND 3 TRADING LOGIC ---
 * Executes a trade between two teams.
 * Expects a complex body: {
 * teamOne: { teamNumber, itemsToSend: [itemId1], moneyToSend: 50 },
 * teamTwo: { teamNumber, itemsToSend: [itemId2], moneyToSend: 0 }
 * }
 */
exports.executeTrade = async (req, res) => {
    try {
        const { teamOne, teamTwo } = req.body;

        const teamA = await Team.findOne({ teamNumber: teamOne.teamNumber });
        const teamB = await Team.findOne({ teamNumber: teamTwo.teamNumber });

        if (!teamA || !teamB) {
            return res.status(404).json({ message: 'One or both teams not found.' });
        }

        const teamA_itemsToSend = teamOne.itemsToSend || [];
        const teamA_moneyToSend = teamOne.moneyToSend || 0;
        const teamB_itemsToSend = teamTwo.itemsToSend || [];
        const teamB_moneyToSend = teamTwo.moneyToSend || 0;

        // --- VALIDATION ---
        // Check if teams have the items they are sending
        for (const itemId of teamA_itemsToSend) {
            if (!teamA.inventory.includes(itemId)) return res.status(400).json({ message: `Team ${teamA.teamNumber} does not own item ID ${itemId}` });
        }
        for (const itemId of teamB_itemsToSend) {
            if (!teamB.inventory.includes(itemId)) return res.status(400).json({ message: `Team ${teamB.teamNumber} does not own item ID ${itemId}` });
        }

        // Check if teams have enough money
        if (teamA.balance < teamA_moneyToSend) return res.status(400).json({ message: `Team ${teamA.teamNumber} has insufficient balance for trade.` });
        if (teamB.balance < teamB_moneyToSend) return res.status(400).json({ message: `Team ${teamB.teamNumber} has insufficient balance for trade.` });

        // --- EXECUTE THE TRADE ---
        // 1. Handle money transfer
        teamA.debit += teamA_moneyToSend;
        teamB.credit += teamA_moneyToSend;
        teamB.debit += teamB_moneyToSend;
        teamA.credit += teamB_moneyToSend;

        // 2. Handle item transfer
        // Remove items from senders
        teamA.inventory = teamA.inventory.filter(item => !teamA_itemsToSend.includes(item.toString()));
        teamB.inventory = teamB.inventory.filter(item => !teamB_itemsToSend.includes(item.toString()));
        // Add items to receivers
        teamA.inventory.push(...teamB_itemsToSend);
        teamB.inventory.push(...teamA_itemsToSend);

        await teamA.save();
        await teamB.save();

        // --- LOG TRANSACTIONS ---
        const tradeNote = `Trade between Team ${teamA.teamNumber} and Team ${teamB.teamNumber}.`;
        const transactionA = new Transaction({ type: 'Trade', teamId: teamA._id, amount: teamA_moneyToSend, round: 3, notes: tradeNote });
        const transactionB = new Transaction({ type: 'Trade', teamId: teamB._id, amount: teamB_moneyToSend, round: 3, notes: tradeNote });
        await Transaction.insertMany([transactionA, transactionB]);

        res.status(200).json({ message: 'Trade executed successfully.' });
    } catch (error) {
        console.error("Error in executeTrade:", error);
        res.status(500).json({ message: 'Server error during trade.' });
    }
};


/**
 * Gets the full transaction history, can be filtered by round.
 * Example: /api/admin/transactions?round=1
 */
exports.getFullTransactionHistory = async (req, res) => {
  try {
    const { round } = req.query; // --- MODIFIED: Look for round in query ---
    const filter = {};
    if (round) {
      filter.round = round;
    }

    const transactions = await Transaction.find(filter) // --- MODIFIED: Use filter ---
      .sort({ timestamp: -1 })
      .populate('teamId', 'teamNumber')
      .populate('itemId', 'name');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching history.' });
  }
};

// --- NEW: Edit a transaction ---
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        // Logic to update transaction, recalculate team balances etc.
        // This can be complex, for now let's just update notes/amount
        const { amount, notes } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(id, { amount, notes }, { new: true });
        if(!transaction) return res.status(404).json({ message: 'Transaction not found.'});
        // NOTE: This does NOT automatically recalculate team balances. A full implementation would require that.
        res.status(200).json({ message: 'Transaction updated.', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating transaction.' });
    }
};

// --- NEW: Delete a transaction ---
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);
        if(!transaction) return res.status(404).json({ message: 'Transaction not found.'});
        // NOTE: This does NOT automatically refund teams. A full implementation would require that.
        res.status(200).json({ message: 'Transaction deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting transaction.' });
    }
};