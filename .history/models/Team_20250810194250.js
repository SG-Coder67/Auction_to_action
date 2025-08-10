const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true }, // unique login code
  isActive: { type: Boolean, default: false } // false = 0 (not logged in), true = 1 (logged in)
});

const Team = mongoose.model('Team', teamSchema, 'teamData'); // ✅ third argument = collection name

module.exports = Team;