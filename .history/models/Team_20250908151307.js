const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamCode: { type: String, required: true, unique: true }, // Your custom ID
  teamName: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 20000 },
  // Inventory is now a simple list of the custom item codes they own
  inventory: [{ type: String }] 
});

module.exports = mongoose.model('Team', teamSchema);