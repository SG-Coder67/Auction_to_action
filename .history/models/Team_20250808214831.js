const mongooseTeam = require('mongoose');

const teamSchema = new mongooseTeam.Schema({
  teamName: { type: String, required: true, unique: true },
  teamLeader: { 
    registerNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  members: [{ // A simple list of names
    type: String,
  }],
  budget: { type: Number, default: 20000 },
});

module.exports = mongooseTeam.model('Team', teamSchema);

