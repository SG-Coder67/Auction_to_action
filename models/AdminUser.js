const mongooseAdmin = require('mongoose');

const adminUserSchema = new mongooseAdmin.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

module.exports = mongooseAdmin.model('AdminUser', adminUserSchema);