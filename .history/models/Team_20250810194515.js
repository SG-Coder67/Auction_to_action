const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true }, // This is the unique login code
  isActive: { type: Boolean, default: false }, // false = not logged in, true = logged in
  budget: { type: Number, default: 20000 },
  members: [{ type: String }],
});

// The collection will be named 'teams' by default.
module.exports = mongoose.model('Team', teamSchema);