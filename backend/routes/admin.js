const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');
const Activity = require('../models/Activity');
const Setting = require('../models/Setting');
const authRoutes = require('./auth');
const authenticate = authRoutes.authenticate;
const requireRole = authRoutes.requireRole;

const DEFAULT_SETTINGS = {
  siteName: 'CivicEye',
  supportEmail: 'support@civiceye.app',
  autoRoutingEnabled: true,
  slaHours: 72,
  allowSelfRegistration: true,
};

router.use(authenticate, requireRole('admin'));

router.get('/analytics', async (req, res) => {
  try {
    const { from, to, departmentId, category } = req.query;
    const match = {};
    if (departmentId && mongoose.isValidObjectId(departmentId)) {
      match.department = mongoose.Types.ObjectId(departmentId);
    }
    if (category) {
      match.category = category;
    }
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const [usersCount, officersCount, departmentsCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'officer' }),
      Department.countDocuments(),
    ]);

    const total = await Complaint.countDocuments(match);
    const statusCounts = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusMap = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13);
    startDate.setHours(0, 0, 0, 0);
    const trendsDocs = await Complaint.aggregate([
      { $match: { ...match, createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
      } },
      { $sort: { _id: 1 } }
    ]);

    const trendMap = trendsDocs.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
    const trends = Array.from({ length: 14 }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const formatted = date.toISOString().slice(0, 10);
      const doc = trendMap[formatted] || { count: 0, resolved: 0 };
      return { date: formatted, count: doc.count, resolved: doc.resolved };
    });

    const byCategory = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', count: 1 } }
    ]);

    const byDepartment = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$department', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, department: { $ifNull: ['$department.name', 'Unassigned'] }, count: 1, resolved: 1 } }
    ]);

    const resolutionDocs = await Complaint.aggregate([
      { $match: { ...match, status: 'resolved' } },
      { $project: { durationHours: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 3600000] } } }
    ]);
    const avgResolutionHours = resolutionDocs.length
      ? Math.round(resolutionDocs.reduce((sum, item) => sum + item.durationHours, 0) / resolutionDocs.length)
      : 0;

    res.json({
      success: true,
      data: {
        totals: {
          complaints: total,
          pending: statusMap.pending || 0,
          inProgress: statusMap.in_progress || 0,
          resolved: statusMap.resolved || 0,
          rejected: statusMap.rejected || 0,
          users: usersCount,
          officers: officersCount,
          departments: departmentsCount,
        },
        resolutionRate: total ? Math.round(((statusMap.resolved || 0) / total) * 100) : 0,
        avgResolutionHours,
        trends,
        byCategory,
        byDepartment,
        byStatus: ['pending', 'assigned', 'in_progress', 'resolved', 'rejected'].map((status) => ({ status, count: statusMap[status] || 0 })),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/heatmap', async (req, res) => {
  try {
    const { from, to, category } = req.query;
    const filter = { 'location.latitude': { $exists: true }, 'location.longitude': { $exists: true } };
    if (category) filter.category = category;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    const complaints = await Complaint.find(filter).lean();
    const data = complaints.map((complaint) => [
      complaint.location.latitude,
      complaint.location.longitude,
      0.4 + (complaint.status === 'resolved' ? 0.1 : 0.4)
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/activities', async (req, res) => {
  try {
    const { role, action, q, page = 1, limit = 100 } = req.query;
    const filter = {};
    if (role) filter.userRole = role;
    if (action) filter.action = action;
    if (q) {
      filter.$or = [
        { userName: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
        { target: { $regex: q, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Activity.countDocuments(filter),
    ]);
    res.json({ success: true, data, total, page: Number(page), pages: Math.max(1, Math.ceil(total / Number(limit))) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { role, q, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      User.find(filter).select('-passwordHash').skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter)
    ]);

    res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / Number(limit) || 1) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id', async (req, res) => {
  try {
    const update = {};
    const { name, email, phone, role } = req.body;
    if (name) update.name = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;
    if (role) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    let settings = await Setting.findOne().lean();
    if (!settings) {
      settings = await Setting.create(DEFAULT_SETTINGS);
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const update = req.body || {};
    const settings = await Setting.findOneAndUpdate({}, update, { new: true, upsert: true, setDefaultsOnInsert: true }).lean();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const { type = 'complaints', from, to } = req.query;
    const range = {};
    if (from || to) {
      range.createdAt = {};
      if (from) range.createdAt.$gte = new Date(from);
      if (to) range.createdAt.$lte = new Date(to);
    }

    let data = [];
    if (type === 'officers') {
      data = await User.find({ role: 'officer' }).select('name email phone').lean();
    } else if (type === 'departments') {
      data = await Department.find().select('name').lean();
    } else {
      data = await Complaint.find(range).populate('citizen department assignedOfficer').lean();
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
