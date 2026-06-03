const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authRoutes = require('./auth');
const authenticate = authRoutes.authenticate;

router.get('/', authenticate, async (req, res) => {
  try {
    const filter = { userId: req.userId };
    const data = await Notification.find(filter).sort({ createdAt: -1 }).lean();
    const unreadCount = data.filter((n) => !n.read).length;
    res.json({ success: true, data, total: data.length, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.userId, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
