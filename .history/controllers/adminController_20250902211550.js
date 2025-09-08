// controllers/adminController.js

// ... (make sure Team and Item models are required at the top)

exports.awardBid = async (req, res) => {
  try {
    const { teamNumber, itemId, price, round } = req.body;
    const team = await Team.findOne({ teamNumber });
    const item = await Item.findById(itemId);
    // ... (your existing validation logic) ...

    // Update team and item
    team.debit += Number(price);
    team.inventory.push(itemId);
    await team.save();
    item.highestBidAmount = price;
    await item.save();

    // ... (your existing transaction logging) ...

    // ✅ SEND THE REAL-TIME UPDATE!
    // This broadcasts a message to every connected client.
    req.io.emit('new_bid_won', {
      teamNumber: team.teamNumber,
      itemName: item.name,
      price: price
    });
    
    res.status(200).json({ message: 'Bid awarded successfully' });
  } catch (error) {
    console.error("Error in awardBid:", error);
    res.status(500).json({ message: 'Server error while awarding bid.' });
  }
};

// ... (rest of your controller file)