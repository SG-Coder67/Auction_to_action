const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['ResourceBundle', 'MysteryBox', 'Enterprise', 'Product', 'Special'], 
    required: true 
  },
  basePrice: { type: Number, required: true },
  highestBidAmount: { type: Number, default: 0 },
  resources: { type: Map, of: Number }
});

module.exports = mongoose.model('Item', itemSchema);