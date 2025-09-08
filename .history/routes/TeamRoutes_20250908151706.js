const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protectTeam } = require('../middleware/authMiddleware'); // You will need this middleware

// Public login route
router.post('/login', teamController.loginTeam);

// Protected routes for logged-in teams
router.get('/me', protectTeam, teamController.getMyTeamData);
router.get('/items', protectTeam, teamController.getAvailableItems);
router.get('/history', protectTeam, teamController.getPublicHistory);

module.exports = router;