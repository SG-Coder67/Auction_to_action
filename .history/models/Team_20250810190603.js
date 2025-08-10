const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, unique: true, required: true },
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: false },
  budget: { type: Number, default: 20000 },
  members: [{ type: String }],
});

module.exports = mongoose.model('Team', teamSchema);