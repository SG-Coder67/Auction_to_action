const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  teamOne: {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamNumber: { type: Number, required: true },
    itemsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    moneySent: { type: Number, default: 0 }
  },
  teamTwo: {
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    teamNumber: { type: Number, required: true },
    itemsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    moneySent: { type: Number, default: 0 }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trade', tradeSchema);