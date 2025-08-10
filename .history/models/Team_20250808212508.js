const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamCode: { type: String, required: true, unique: true },
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'ParticipantUser', required: true },
  maxSize: { type: Number, required: true, enum: [3, 4, 5] }, // Enforces team size
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParticipantUser' }],
  budget: { type: Number, default: 20000 },
});

// Automatically generate a unique team code before saving a new team
teamSchema.pre('validate', function(next) {
  if (this.isNew) {
    const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);
    this.teamCode = nanoid();
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);