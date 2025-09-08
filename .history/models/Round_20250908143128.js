const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundNumber: {
    type: Number,
    required: true,
    default: 1
  },
  roundStatus: {
    type: String,
    enum: ['not_started', 'ongoing', 'ended'],
    default: 'not_started'
  }
}, { timestamps: true });

module.exports = mongoose.model('Round', roundSchema);