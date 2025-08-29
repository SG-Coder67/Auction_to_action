const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamNumber: { type: Number, unique: true, required: true },
  teamCredential: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: false },
  budget: { type: Number, default: 20000 },
  inventory: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' 
  }],
  // V V V --- ADD THIS NEW FIELD --- V V V
  resources: {
    type: Map,
    of: Number, // This will store data like { "Technology": 6, "Utilities": 2 }
    default: {}
  }
});

module.exports = mongoose.model('Team', teamSchema, 'teamData');