const mongoose = require('mongoose');

const tradeHistorySchema = new mongoose.Schema({
  tradeId: { type: Number, required: true, unique: true }, // Your custom ID
  teamOneCode: { type: String, required: true },
  teamOneName: { type: String, required: true },
  teamTwoCode: { type: String, required: true },
  teamTwoName: { type: String, required: true },
  teamOneTrade: {
      items: [{ itemName: String, quantity: Number }],
      money: { type: Number, default: 0 }
  },
  teamTwoTrade: {
      items: [{ itemName: String, quantity: Number }],
      money: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TradeHistory', tradeHistorySchema);