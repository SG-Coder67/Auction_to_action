const Auction = require('../models/auctionModel');
exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find();
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.createAuction = async (req, res) => {
    const { itemName } = req.body;
    try {
        const auction = new Auction({ itemName });
        const saved = await auction.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.updateBid = async (req, res) => {
    const { id } = req.params;
    const { bidAmount, bidderName } = req.body;
    try {
        const auction = await Auction.findById(id);
        if (!auction) return res.status(404).json({ message: "Auction item not found" });
        if (bidAmount > auction.highestBid) {
            auction.highestBid = bidAmount;
            auction.highestBidder = bidderName;
            const updated = await auction.save();
            res.json(updated);
        } else {
            res.status(400).json({ message: "Bid must be higher than current highest bid" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};