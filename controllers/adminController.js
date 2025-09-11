const bcrypt = require('bcryptjs');
const Team = require('../models/Team');
const GameItem = require('../models/GameItem');
const BidHistory = require('../models/BidHistory');
const TradeHistory = require('../models/TradeHistory');
const AdminUser = require('../models/AdminUser');

// --- ADMIN MANAGEMENT (CRUD for other admins) ---

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

// --- TEAM MANAGEMENT (CRUD by Admin) ---

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).select('-password');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching teams.' });
    }
};

exports.addTeam = async (req, res) => {
    try {
        const { teamCode, teamName, password, initialBalance } = req.body;
        if (!teamCode || !teamName || !password) {
            return res.status(400).json({ message: 'Team Code, Name, and Password are required.' });
        }
        const existingTeam = await Team.findOne({ teamCode });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team Code already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeam = new Team({
            teamCode,
            teamName,
            password: hashedPassword,
            credit: initialBalance || 20000
        });
        await newTeam.save();
        res.status(201).json({ message: 'Team created successfully.', team: newTeam });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating team.', error: error.message });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { teamName, password, credit, debit } = req.body;
        const updateData = {};
        if (teamName) updateData.teamName = teamName;
        if (credit) updateData.credit = credit;
        if (debit) updateData.debit = debit;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        const updatedTeam = await Team.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!updatedTeam) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ message: 'Team updated successfully.', team: updatedTeam });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating team.', error: error.message });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTeam = await Team.findByIdAndDelete(id);
        if (!deletedTeam) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ message: 'Team deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting team.', error: error.message });
    }
};

// --- GAME LOGIC ---

exports.awardBid = async (req, res) => {
  try {
    const { teamCode, itemCode, bidAmount } = req.body;
    const team = await Team.findOne({ teamCode });
    const item = await GameItem.findOne({ itemCode });

    if (!team || !item) {
      return res.status(404).json({ message: 'Team or Item not found.' });
    }
    if (item.isBidOn) {
      return res.status(400).json({ message: 'This item has already been won.' });
    }
    if (team.balance < bidAmount) {
      return res.status(400).json({ message: `Team balance is too low.` });
    }

    team.debit += Number(bidAmount);
    team.inventory.push(item.itemCode);

    item.resources.forEach((quantity, resourceName) => {
        const currentQuantity = team.resources.get(resourceName) || 0;
        team.resources.set(resourceName, currentQuantity + quantity);
    });
    await team.save();

    item.isBidOn = true;
    await item.save();

    const history = new BidHistory({
      round: item.round,
      itemCode: item.itemCode,
      itemName: item.name,
      teamCode: team.teamCode,
      teamName: team.teamName,
      bidAmount: bidAmount
    });
    await history.save();

    res.status(200).json({ message: 'Bid awarded successfully.', team, history });
  } catch (error) {
    res.status(500).json({ message: 'Server error awarding bid.', error: error.message });
  }
};

exports.executeTrade = async (req, res) => {
    try {
        const { teamOneCode, teamTwoCode, tradeDetails } = req.body;
        const teamA = await Team.findOne({ teamCode: teamOneCode });
        const teamB = await Team.findOne({ teamCode: teamTwoCode });

        if (!teamA || !teamB) {
            return res.status(404).json({ message: 'One or both teams not found.' });
        }

        const { teamOneGivesItems, teamOneGivesMoney, teamTwoGivesItems, teamTwoGivesMoney } = tradeDetails;

        if (teamA.balance < teamOneGivesMoney) return res.status(400).json({ message: `${teamA.teamName} does not have enough money.` });
        for (const item of teamOneGivesItems) {
            if ((teamA.resources.get(item) || 0) < 1) return res.status(400).json({ message: `${teamA.teamName} does not have ${item}.` });
        }
        if (teamB.balance < teamTwoGivesMoney) return res.status(400).json({ message: `${teamB.teamName} does not have enough money.` });
        for (const item of teamTwoGivesItems) {
            if ((teamB.resources.get(item) || 0) < 1) return res.status(400).json({ message: `${teamB.teamName} does not have ${item}.` });
        }

        teamA.debit += teamOneGivesMoney;
        teamB.credit += teamOneGivesMoney;
        teamB.debit += teamTwoGivesMoney;
        teamA.credit += teamTwoGivesMoney;

        teamOneGivesItems.forEach(item => {
            teamA.resources.set(item, teamA.resources.get(item) - 1);
            teamB.resources.set(item, (teamB.resources.get(item) || 0) + 1);
        });
        teamTwoGivesItems.forEach(item => {
            teamB.resources.set(item, teamB.resources.get(item) - 1);
            teamA.resources.set(item, (teamA.resources.get(item) || 0) + 1);
        });
        await teamA.save();
        await teamB.save();

        const history = new TradeHistory({
            teamOne: { name: teamA.teamName, code: teamA.teamCode },
            teamTwo: { name: teamB.teamName, code: teamB.teamCode },
            tradeDetails: tradeDetails
        });
        await history.save();

        res.status(200).json({ message: 'Trade executed successfully!', history });
    } catch (error) {
        res.status(500).json({ message: 'Server error during trade.', error: error.message });
    }
};

// --- HISTORY FETCHING ---

exports.getBidHistory = async (req, res) => {
    try {
        const history = await BidHistory.find({}).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bid history' });
    }
};

exports.getTradeHistory = async (req, res) => {
    try {
        const history = await TradeHistory.find({}).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trade history' });
    }
};
exports.getTeamsStatus = async (req, res) => {
    try {
        const teams = await Team.find({}, 'teamCode teamName isActive');
        res.status(200).json(teams);
    } catch (error) {
        console.error("ERROR FETCHING TEAM STATUS:", error);
        res.status(500).json({ message: 'Error fetching team statuses' });
    }
};
