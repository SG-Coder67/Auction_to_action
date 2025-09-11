const mongoose = require('mongoose');

// schema for each item in a bid
const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true }
});

// schema for each bid
const bidSchema = new mongoose.Schema({
  item_no: { type: Number, required: true }, // Bid number
  items: { type: [itemSchema], required: true }, // Array of {itemName, quantity}
  base_price: { type: Number, required: true }, // Base price for this bid
  image_path: { type: String, default: "" } // Optional image path
});

// schema for Round One
const roundOneSchema = new mongoose.Schema({
  ID: { type: Number, required: true, unique: true },
  item_list: { type: [bidSchema], required: true },   // filled with actual bids
  item_list_bidded: { type: [bidSchema], default: [] } // same schema, but empty initially
});

const RoundOne = mongoose.model("RoundOne", roundOneSchema, "roundOne");

module.exports = RoundOne;
