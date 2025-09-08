const mongoose = require('mongoose');

const bidHistorySchema = new mongoose.Schema({
  bidId: { type: Number, required: true, unique: true }, // Your custom ID
  round: { type: Number, enum: [1, 2], required: true },
  teamCode: { type: String, required: true },
  teamName: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  items: [{
      itemCode: { type: String, required: true },
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true }
  }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BidHistory', bidHistorySchema);