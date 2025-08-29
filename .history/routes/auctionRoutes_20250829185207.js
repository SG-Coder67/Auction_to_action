const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
router.get('/', auctionController.getAllAuctions);
router.post('/', auctionController.createAuction);
router.put('/:id/bid', auctionController.updateBid);
module.exports = router;