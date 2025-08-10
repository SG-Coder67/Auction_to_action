const mongoose = require('mongoose');

// A simple schema to define what a construction looks like
const constructionSchema = new mongoose.Schema({
    name: String,
    price: Number,
    requirements: [String]
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamNumber: { type: Number, required: true, unique: true },
  teamLeader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ParticipantUser', 
    required: true 
  },
  members: [{
    type: String,
  }],
  budget: { type: Number, default: 20000 },
  constructions: [constructionSchema]
});

module.exports = mongoose.model('Team', teamSchema);
