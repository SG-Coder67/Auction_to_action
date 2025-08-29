const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

// Award a winning bid to a team
exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price } = req.body;

    // --- 1. Validation ---
    if (!teamNumber || !itemId || price == null) {
      return res.status(400).json({ message: 'Missing teamNumber, itemId, or price.' });
    }

    const team = await Team.findOne({ teamNumber: teamNumber });
    const item = await Item.findById(itemId);

    if (!team) {
      return res.status(404).json({ message: `Team #${teamNumber} not found.` });
    }
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    if (team.budget < price) {
      return res.status(400).json({ message: `Team #${teamNumber}'s budget is too low.` });
    }

    // --- 2. Update Team Data ---
    team.budget -= price;
    team.inventory.push(itemId); // Add the item's ID to their inventory
    await team.save();

    // --- 3. Log the Transaction ---
    const newTransaction = new Transaction({
      type: 'Bid',
      teamId: team._id,
      itemId: item._id,
      amount: price,
      notes: `Team #${teamNumber} won ${item.name} for ${price}`
    });
    await newTransaction.save();
    
    // --- 4. Send Success Response ---
    res.status(200).json({
      message: `Successfully awarded '${item.name}' to Team #${teamNumber}.`,
      updatedBudget: team.budget
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};