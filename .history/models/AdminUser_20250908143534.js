const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
});

adminUserSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

module.exports = mongoose.model('AdminUser', adminUserSchema);