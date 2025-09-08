const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  // Your custom, human-readable ID (e.g., "R1-BID-01", "R2-MB-14")
  itemCode: { type: String, required: true, unique: true }, 
  name: { type: String, required: true },
  description: { type: String },
  // This field distinguishes between the different types of items
  itemType: {
    type: String,
    required: true,
    enum: ['BID', 'MYSTERY_BOX', 'ENTERPRISE', 'PRODUCT']
  },
  round: { type: Number, required: true }, // The round this item is associated with
  basePrice: { type: Number, default: 0 },
  // For Enterprises/Products: stores what resources are needed to build them
  // Example: { "Property": 2, "Skilled Labour": 2 }
  requirements: { type: Map, of: Number },
  // For Bids/Mystery Boxes: stores what resources are given
  // Example: { "Technology": 6, "Utilities": 2 }
  payload: { type: Map, of: Number },
});

module.exports = mongoose.model('Item', itemSchema);