const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const authRoutes = require('./auth');
const authenticate = authRoutes.authenticate;
const requireRole = authRoutes.requireRole;

router.use(authenticate);

function buildOfficerStats(stats) {
  return stats.reduce((acc, stat) => {
    acc[stat._id.toString()] = stat;
    return acc;
  }, {});
}

router.get('/', async (req, res) => {
  try {
    const { q, departmentId, page = 1, limit = 50 } = req.query;
    const filter = { role: 'officer' };
    if (departmentId && mongoose.isValidObjectId(departmentId)) {
      filter.department = departmentId;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [officers, total, rawStats] = await Promise.all([
      User.find(filter).populate('department', 'name').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
      Complaint.aggregate([
        { $match: { assignedOfficer: { $ne: null } } },
        { $group: {
          _id: '$assignedOfficer',
          totalAssigned: { $sum: 1 },
          activeCount: { $sum: { $cond: [{ $in: ['$status', ['assigned', 'in_progress']] }, 1, 0] } },
          resolvedCount: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        } }
      ])
    ]);

    const stats = buildOfficerStats(rawStats);
    const data = officers.map((officer) => {
      const metric = stats[officer._id.toString()] || {};
      return {
        ...officer,
        activeCount: metric.activeCount || 0,
        resolvedCount: metric.resolvedCount || 0,
        rating: Number(Math.min(5, 3.8 + (metric.resolvedCount || 0) * 0.12).toFixed(1)),
      };
    });

    res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / Number(limit) || 1) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requireRole('admin'), async (req, res) => {
  try {
    const { name, email, phone, password, departmentId } = req.body;
    if (!name || !email || !password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, passwordHash, role: 'officer', department: departmentId || undefined });
    await user.save();
    const data = await User.findById(user._id).populate('department', 'name').lean();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/workload', async (req, res) => {
  try {
    const { departmentId } = req.query;
    const officerFilter = { role: 'officer' };
    if (departmentId && mongoose.isValidObjectId(departmentId)) {
      officerFilter.department = departmentId;
    }

    const [officers, rawStats] = await Promise.all([
      User.find(officerFilter).populate('department', 'name').lean(),
      Complaint.aggregate([
        { $match: { assignedOfficer: { $ne: null }, ...(departmentId && mongoose.isValidObjectId(departmentId) ? { department: mongoose.Types.ObjectId(departmentId) } : {}) } },
        { $group: {
          _id: '$assignedOfficer',
          assigned: { $sum: 1 },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        } }
      ])
    ]);

    const stats = buildOfficerStats(rawStats);
    const data = officers.map((officer) => {
      const metric = stats[officer._id.toString()] || {};
      return {
        officerId: officer._id.toString(),
        name: officer.name,
        department: officer.department?.name || 'Unassigned',
        assigned: metric.assigned || 0,
        inProgress: metric.inProgress || 0,
        resolved: metric.resolved || 0,
        load: Math.min(100, (metric.assigned || 0) * 12),
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/performance', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Officer not found' });
    }

    const officer = await User.findById(req.params.id).lean();
    if (!officer || officer.role !== 'officer') {
      return res.status(404).json({ success: false, message: 'Officer not found' });
    }

    const complaints = await Complaint.find({ assignedOfficer: req.params.id }).lean();
    const totalAssigned = complaints.length;
    const resolvedComplaints = complaints.filter((c) => c.status === 'resolved');
    const resolved = resolvedComplaints.length;
    const avgResolutionHours = resolved
      ? Math.round(resolvedComplaints.reduce((sum, c) => sum + ((new Date(c.updatedAt)) - (new Date(c.createdAt))) / 3600000, 0) / resolved)
      : 0;
    const rating = Number(Math.min(5, 3.8 + resolved * 0.12).toFixed(1));

    res.json({ success: true, data: { totalAssigned, resolved, avgResolutionHours, rating } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id', requireRole('admin'), async (req, res) => {
  try {
    const update = {};
    const { name, email, phone, password, departmentId } = req.body;
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (departmentId) update.department = departmentId;
    if (password && password.length >= 4) {
      update.passwordHash = await bcrypt.hash(password, 10);
    }

    const officer = await User.findByIdAndUpdate(req.params.id, update, { new: true }).populate('department', 'name').lean();
    if (!officer || officer.role !== 'officer') {
      return res.status(404).json({ success: false, message: 'Officer not found' });
    }

    res.json({ success: true, data: officer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    const officer = await User.findById(req.params.id).lean();
    if (!officer || officer.role !== 'officer') {
      return res.status(404).json({ success: false, message: 'Officer not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const officer = await User.findById(req.params.id).populate('department', 'name').lean();
    if (!officer || officer.role !== 'officer') {
      return res.status(404).json({ success: false, message: 'Officer not found' });
    }
    res.json({ success: true, data: officer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
