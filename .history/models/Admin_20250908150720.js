const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: Number, required: true, unique: true }, // Your custom ID
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', required: true }
});

module.exports = mongoose.model('Admin', adminSchema);