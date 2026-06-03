const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/Department');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

async function getDepartmentCounts(departmentId) {
  const [officerCount, totalComplaints, resolvedCount, openCount] = await Promise.all([
    User.countDocuments({ role: 'officer', department: departmentId }),
    Complaint.countDocuments({ department: departmentId }),
    Complaint.countDocuments({ department: departmentId, status: 'resolved' }),
    Complaint.countDocuments({ department: departmentId, status: { $in: ['pending', 'assigned', 'in_progress'] } }),
  ]);
  return { officerCount, totalComplaints, resolvedCount, openCount };
}

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().lean();
    const [officerStats, complaintStats] = await Promise.all([
      User.aggregate([
        { $match: { role: 'officer', department: { $ne: null } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $match: { department: { $ne: null } } },
        {
          $group: {
            _id: '$department',
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
            open: { $sum: { $cond: [{ $in: ['$status', ['pending', 'assigned', 'in_progress']] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const officerCountMap = officerStats.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});
    const complaintCountMap = complaintStats.reduce((acc, item) => {
      acc[item._id.toString()] = {
        total: item.total,
        resolved: item.resolved,
        open: item.open,
      };
      return acc;
    }, {});

    const data = departments.map((department) => {
      const departmentId = department._id.toString();
      const complaintCounts = complaintCountMap[departmentId] || { total: 0, resolved: 0, open: 0 };
      return {
        _id: department._id,
        name: department.name,
        description: department.description || '',
        categories: Array.isArray(department.categories) ? department.categories : [],
        officerCount: officerCountMap[departmentId] ?? 0,
        openCount: complaintCounts.open,
        resolvedCount: complaintCounts.resolved,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/stats', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).lean();
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const counts = await getDepartmentCounts(req.params.id);
    res.json({ success: true, data: counts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).lean();
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const counts = await getDepartmentCounts(req.params.id);
    const data = {
      _id: department._id,
      name: department.name,
      description: department.description || '',
      categories: Array.isArray(department.categories) ? department.categories : [],
      officerCount: counts.officerCount,
      openCount: counts.openCount,
      resolvedCount: counts.resolvedCount,
    };
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
