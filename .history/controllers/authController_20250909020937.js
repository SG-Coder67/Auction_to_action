// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const Team = require('../models/Team');

// --- ADMIN AUTH ---
exports.registerAdmin = async (req, res) => { /* ... move register logic here ... */ };
exports.loginAdmin = async (req, res) => { /* ... move login logic here ... */ };

// --- TEAM AUTH ---
exports.loginTeam = async (req, res) => {
  try {
    const { teamCode, password } = req.body;
    const team = await Team.findOne({ teamCode });

    if (team && (await bcrypt.compare(password, team.password))) {
      const token = jwt.sign(
        { teamId: team._id, teamCode: team.teamCode, role: 'participant' },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid Team Code or Password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
};