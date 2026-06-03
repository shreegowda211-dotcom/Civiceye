const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userRole: { type: String, enum: ['citizen', 'officer', 'admin'] },
  userName: String,
  action: {
    type: String,
    enum: [
      'user_registered',
      'complaint_created',
      'complaint_updated',
      'complaint_assigned',
      'complaint_resolved',
      'status_changed',
      'profile_updated',
      'login',
      'logout'
    ]
  },
  target: String, // complaint id, user id, etc
  targetType: String, // 'complaint', 'user', etc
  message: String,
  metadata: mongoose.Schema.Types.Mixed, // extra details like old/new values
}, { timestamps: true });

ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ userId: 1 });
ActivitySchema.index({ action: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
