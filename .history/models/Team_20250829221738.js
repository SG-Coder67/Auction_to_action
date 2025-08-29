const mongoose = require('mongoose');

// models/Team.js - CORRECTED
const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: false },
  budget: { type: Number, default: 20000 }, // Keep only this one
  members: [{ type: String }],
});

// This explicitly tells Mongoose to name the collection 'teamData'
module.exports = mongoose.model('Team', teamSchema, 'teamData');