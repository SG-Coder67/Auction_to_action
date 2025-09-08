const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamCode: { type: String, required: true, unique: true }, // Your custom ID, e.g., "T01"
  teamName: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 20000 },
  usedAmount: { type: Number, default: 0 },
  inventory: [{
      itemCode: { type: String, required: true }, // References the custom item code
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      bidAmount: { type: Number, default: 0 }
  }]
});

module.exports = mongoose.model('Team', teamSchema);