const express = require("express");
const router = express.Router();
const userDashboardController = require("../controllers/userDashboardController");

// Get user's transaction history
router.get("/:userId/transactions", userDashboardController.getUserTransactions);

// Get team budget
router.get("/team/:teamId/budget", userDashboardController.getTeamBudget);

module.exports = router;