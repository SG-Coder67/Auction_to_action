const mongoose = require('mongoose');

const participantUserSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'participant' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('ParticipantUser', participantUserSchema);
