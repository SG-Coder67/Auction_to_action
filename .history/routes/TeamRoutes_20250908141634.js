const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protectTeam } = require('../middleware/authMiddleware');

router.post('/login', teamController.loginTeam);

router.get('/dashboard', protectTeam, teamController.getDashboardData);
router.get('/items', protectTeam, teamController.getAvailableItems);
router.get('/my-history', protectTeam, teamController.getMyTransactionHistory);
router.get('/bid-history', protectTeam, teamController.getPublicBidHistory);
router.get('/trade-history', protectAdmin, teamController.getPublicTradeHistory); // Should be protected

module.exports = router;