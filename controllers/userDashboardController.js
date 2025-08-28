const Transaction = require("../models/Transaction");
const Team = require("../models/Team");

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .populate("itemId", "name")
      .sort({ timestamp: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get budget of a team
exports.getTeamBudget = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId).select("budget name");
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};