const mongoose = require('mongoose');

const constructionSchema = new mongoose.Schema({
    name: String,
    price: Number,
    requirements: [String]
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamNumber: { type: Number, required: true, unique: true },
  teamLeader: {
    registerNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  members: [{
    type: String,
  }],
  budget: { type: Number, default: 20000 },
  constructions: [constructionSchema]
});

module.exports = mongoose.model('Team', teamSchema);