const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: false },
  budget: { type: Number, default: 20000 },
  members: [{ type: String }],
  // This is the missing field
  inventory: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' 
  }]
});

module.exports = mongoose.model('Team', teamSchema, 'teamData');