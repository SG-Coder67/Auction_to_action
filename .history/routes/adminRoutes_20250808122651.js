const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser'); // Import the blueprint

const router = express.Router(); // Create a mini-router for admin tasks

// A helper "security guard" middleware just for this file
const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

// Endpoint to create the first admin user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await AdminUser.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin user created.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint for Admins to log in
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
      res.json({ message: 'Admin login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// A protected endpoint for the Admin Dashboard
router.get('/dashboard', protectAdmin, (req, res) => {
    const dashboardData = {
      message: 'Welcome to the Admin Dashboard!',
      adminUserId: req.user.userId,
    };
    res.json(dashboardData);
});

module.exports = router; // Export the entire router

