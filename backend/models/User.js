const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'officer', 'admin'], default: 'citizen' },
  phone: String,
  avatar: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
