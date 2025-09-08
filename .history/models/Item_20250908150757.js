const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true }, // Your custom ID, e.g., "r1i001", "r2i043"
  itemName: { type: String, required: true },
  round: { type: Number, enum: [1, 2], required: true },
  quantity: { type: Number, default: 1 },
  basePrice: { type: Number, required: true },
  // For items composed of multiple resources
  resources: { type: Map, of: String }
});

module.exports = mongoose.model('Item', itemSchema);