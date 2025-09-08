const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: false },
  credit: { type: Number, default: 20000 },
  debit: { type: Number, default: 0 },
  inventory: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' 
  }],
  resources: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

teamSchema.virtual('balance').get(function() {
  return this.credit - this.debit;
});

module.exports = mongoose.model('Team', teamSchema, 'teamData');