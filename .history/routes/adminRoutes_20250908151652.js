const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware'); // You will need this middleware

// Note: Admin login/register routes should be created in a separate authController
// router.post('/login', authController.adminLogin);

// Get a specific admin's data
router.get('/:adminId', protectAdmin, adminController.getAdminById);

// Team data management
router.get('/teams/all', protectAdmin, adminController.getAllTeams);
router.put('/teams/:teamCode/balance', protectAdmin, adminController.updateTeamBalance);

// Game event management
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// Round management
router.post('/round', protectAdmin, adminController.updateRound);

// Data getters
router.get('/items/all', protectAdmin, adminController.getAllItems);
router.get('/history/all', protectAdmin, adminController.getTransactionHistory);

module.exports = router;