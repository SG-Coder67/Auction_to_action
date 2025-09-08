const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  amount: {
    type: Number,
    required: true,
  },
  round: {
    type: Number,
    enum: [1, 2], // Only for rounds 1 and 2
    required: true,
  },
  type: {
    type: String,
    enum: ['Bid', 'ManualAdjustment'],
    required: true
  },
  notes: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);