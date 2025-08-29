const Team = require('../models/Team');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');

/**
 * Awards a won item to a team after a bid.
 * Expects { teamNumber, itemId, price } in the request body.
 */
exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price } = req.body;

    // --- 1. Validate the incoming data ---
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
      return res.status(400).json({ message: `Team #${teamNumber}'s budget of ${team.budget} is too low.` });
    }

    // --- 2. Update the team's budget and inventory ---
    team.budget -= price;
    team.inventory.push(itemId); // Adds the item's unique ID to the team's inventory array
    await team.save();

    // --- 3. Create a transaction record for the history log ---
    const newTransaction = new Transaction({
      type: 'Bid',
      teamId: team._id,
      itemId: item._id,
      amount: price,
      notes: `Team #${teamNumber} won ${item.name} for ${price}`
    });
    await newTransaction.save();
    
    // --- 4. Send a success response back to the admin dashboard ---
    res.status(200).json({
      message: `Successfully awarded '${item.name}' to Team #${teamNumber}.`,
      updatedBudget: team.budget
    });

  } catch (error) {
    // Handle any unexpected server errors
    console.error("Error in awardBid:", error);
    res.status(500).json({ message: 'Server error while awarding bid.', error: error.message });
  }
};

// You will add other functions like 'executeTrade' here in the future.