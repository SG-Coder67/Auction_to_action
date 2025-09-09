// routes/userAuth.js

const express = require("express");
const router = express.Router();
const Team = require("../models/team.model"); // your Team schema

// User Login (set active = true)
router.post("/login/team", async (req, res) => {
  const { teamNumber, password } = req.body;

  try {
    const team = await Team.findOne({ teamNumber });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Mark user active
    team.isActive = true;
    await team.save();

    res.json({ message: "Login successful", team });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// User Logout (set active = false)
router.post("/logout/team/:teamNumber", async (req, res) => {
  const { teamNumber } = req.params;

  try {
    const team = await Team.findOne({ teamNumber });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // ✅ Mark user inactive
    team.isActive = false;
    await team.save();

    res.json({ message: "Logout successful", team });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
