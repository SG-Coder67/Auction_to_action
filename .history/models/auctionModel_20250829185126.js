const mongoose = require('mongoose');
const auctionSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    highestBid: { type: Number, default: 0 },
    highestBidder: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Auction', auctionSchema);