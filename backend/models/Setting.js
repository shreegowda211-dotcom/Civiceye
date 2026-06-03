const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'CivicEye' },
  supportEmail: { type: String, default: 'support@civiceye.app' },
  autoRoutingEnabled: { type: Boolean, default: true },
  slaHours: { type: Number, default: 72 },
  allowSelfRegistration: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
