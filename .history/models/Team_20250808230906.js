const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamLeader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ParticipantUser', 
    required: true 
  },
  members: [{ 
    type: String,
  }],
  budget: { type: Number, default: 20000 },
});

module.exports = mongoose.model('Team', teamSchema);
