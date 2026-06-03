const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const socketHolder = require('../socket');
const authRoutes = require('./auth');
const { validate, createComplaintSchema, updateStatusSchema, assignComplaintSchema } = require('../validators/complaintValidator');
const authenticate = authRoutes.authenticate;
const requireRole = authRoutes.requireRole;

async function getAutoAssignedDepartment(category) {
  if (!category) return null;
  const cleanCategory = category.toString().trim().toLowerCase();
  let department = await Department.findOne({ categories: { $elemMatch: { $regex: new RegExp(`^${cleanCategory}$`, 'i') } } }).select('_id');
  if (!department && cleanCategory === 'roads') {
    department = await Department.findOne({ name: /public works/i }).select('_id');
  }
  return department;
}

function complaintQuery() {
  return Complaint.find().populate('citizen department assignedOfficer').lean();
}

async function findComplaintByIdOrLegacy(id) {
  let complaint = null;
  if (mongoose.isValidObjectId(id)) {
    complaint = await Complaint.findById(id).populate('citizen department assignedOfficer').lean();
  }
  if (!complaint) {
    complaint = await Complaint.findOne({ legacyId: id }).populate('citizen department assignedOfficer').lean();
  }
  return complaint;
}

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category, q, page = 1, limit = 50 } = req.query;
    let filter = {};
    
    // Admins see all complaints; officers see only their department's; citizens see only their own
    if (req.userRole === 'admin') {
      // no filter modification
    } else if (req.userRole === 'officer') {
      const officer = await User.findById(req.userId).lean();
      filter.department = officer?.department || null;
    } else if (req.userRole === 'citizen') {
      filter.citizen = req.userId;
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Complaint.find(filter).populate('citizen department assignedOfficer').skip(skip).limit(Number(limit)).lean(),
      Complaint.countDocuments(filter)
    ]);
    res.json({ success: true, data, total, page: Number(page), pages: Math.ceil(total / Number(limit) || 1) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const data = await Complaint.find({ citizen: req.userId }).populate('citizen department assignedOfficer').lean();
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/department/:departmentId', authenticate, async (req, res) => {
  try {
    // Only admins and officers in this department can view
    if (req.userRole === 'citizen') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (req.userRole === 'officer') {
      const officer = await User.findById(req.userId).lean();
      if (officer?.department?.toString() !== req.params.departmentId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }
    
    const filter = { department: req.params.departmentId };
    const { status, assignedToMe } = req.query;
    if (status) filter.status = status;
    if (assignedToMe === 'true') filter.assignedOfficer = req.userId;
    const data = await Complaint.find(filter).populate('citizen department assignedOfficer').lean();
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const c = await findComplaintByIdOrLegacy(req.params.id);
    if (!c) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Verify access: admin, assigned officer, or citizen
    // Handle both populated objects and ID strings
    const citizenId = typeof c.citizen === 'object' ? c.citizen?._id?.toString() : c.citizen?.toString();
    const officerId = typeof c.assignedOfficer === 'object' ? c.assignedOfficer?._id?.toString() : c.assignedOfficer?.toString();
    
    const isAdmin = req.userRole === 'admin';
    const isCitizen = req.userRole === 'citizen' && citizenId === req.userId;
    const isAssignedOfficer = req.userRole === 'officer' && officerId === req.userId;
    
    if (!isAdmin && !isCitizen && !isAssignedOfficer) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: c });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', authenticate, validate(createComplaintSchema), async (req, res) => {
  try {
    // Only citizens can create complaints
    if (req.userRole !== 'citizen') {
      return res.status(403).json({ success: false, message: 'Only citizens can create complaints' });
    }

    const payload = req.body;

    const timeline = [{
      status: 'pending',
      message: 'Complaint created',
      remarks: 'Complaint submitted',
      actor: { name: 'Citizen', role: 'citizen' },
      createdAt: new Date()
    }];

    // Auto-assign department only if category matches; never allow client to override
    let departmentId = null;
    if (payload.category) {
      const autoDept = await getAutoAssignedDepartment(payload.category);
      if (autoDept) departmentId = autoDept._id;
    }

    const complaint = new Complaint({
      title: payload.title,
      description: payload.description || '',
      category: payload.category,
      status: 'pending', // Always start as pending
      images: payload.images || [],
      resolutionImages: [],
      location: payload.location || {},
      citizen: req.userId,
      department: departmentId,
      assignedOfficer: null, // Never assign during creation
      timeline
    });
    await complaint.save();
    const data = await Complaint.findById(complaint._id).populate('citizen department assignedOfficer').lean();
    try {
      const activity = await Activity.create({
        userId: req.userId,
        userRole: req.userRole,
        userName: req.userName || 'Citizen',
        action: 'complaint_created',
        target: complaint._id.toString(),
        targetType: 'complaint',
        message: `Created complaint ${complaint.title}`,
      });
      const io = socketHolder.io;
      if (io) io.to('admins').emit('activity:new', activity);
    } catch (err) {
      console.warn('Failed to log complaint creation activity', err.message);
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/upload', (req, res) => {
  const files = [];
  res.json({ success: true, data: { images: files } });
});

router.patch('/:id/status', authenticate, requireRole(['officer']), validate(updateStatusSchema), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).catch(() => null) || await Complaint.findOne({ legacyId: req.params.id });
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Verify officer is assigned to this complaint
    const officerId = typeof complaint.assignedOfficer === 'object' ? complaint.assignedOfficer?._id?.toString() : complaint.assignedOfficer?.toString();
    if (officerId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied - not assigned to this complaint' });
    }

    const status = req.body.status;
    const remarks = req.body.remarks || '';
    complaint.status = status;
    complaint.timeline = complaint.timeline || [];
    complaint.timeline.push({
      status,
      message: remarks,
      remarks,
      actor: {
        _id: req.userId,
        name: req.userName || 'Officer',
        role: req.userRole || 'officer'
      },
      createdAt: new Date()
    });
    await complaint.save();
    const data = await findComplaintByIdOrLegacy(complaint._id.toString());

    // notify citizen about status change
    try {
      const notif = await Notification.create({
        userId: complaint.citizen,
        title: 'Complaint status updated',
        message: `Your complaint "${complaint.title}" is now ${complaint.status}`,
        link: `/complaints/${complaint._id}`
      });
      const io = socketHolder.io;
      if (io && complaint.citizen) io.to(`user:${complaint.citizen.toString()}`).emit('notification:new', notif);
    } catch (e) { console.warn('notify status failed', e.message); }

    try {
      const activity = await Activity.create({
        userId: req.userId,
        userRole: req.userRole,
        userName: req.userName || 'Unknown',
        action: 'complaint_updated',
        target: complaint._id.toString(),
        targetType: 'complaint',
        message: `Updated status to ${complaint.status}`,
      });
      const io = socketHolder.io;
      if (io) io.to('admins').emit('activity:new', activity);
    } catch (err) {
      console.warn('Failed to log complaint status activity', err.message);
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/assign', authenticate, requireRole(['admin']), validate(assignComplaintSchema), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).catch(() => null) || await Complaint.findOne({ legacyId: req.params.id });
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    
    if (req.body.departmentId) complaint.department = req.body.departmentId;
    if (req.body.officerId) complaint.assignedOfficer = req.body.officerId;
    await complaint.save();
    const data = await findComplaintByIdOrLegacy(complaint._id.toString());

    // notify assigned officer
    try {
      if (complaint.assignedOfficer) {
        const notif = await Notification.create({
          userId: complaint.assignedOfficer,
          title: 'New assignment',
          message: `You have been assigned complaint: ${complaint.title}`,
          link: `/officer/complaints/${complaint._id}`
        });
        const io = socketHolder.io;
        if (io) io.to(`user:${complaint.assignedOfficer.toString()}`).emit('notification:new', notif);
      }
    } catch (e) { console.warn('notify assign failed', e.message); }

    try {
      const activity = await Activity.create({
        userId: req.userId,
        userRole: req.userRole,
        userName: req.userName || 'Unknown',
        action: 'complaint_assigned',
        target: complaint._id.toString(),
        targetType: 'complaint',
        message: `Assigned complaint ${complaint.title}`,
      });
      const io = socketHolder.io;
      if (io) io.to('admins').emit('activity:new', activity);
    } catch (err) {
      console.warn('Failed to log complaint assignment activity', err.message);
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).catch(() => null) || await Complaint.findOne({ legacyId: req.params.id });
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    await Complaint.findByIdAndDelete(complaint._id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/history', authenticate, async (req, res) => {
  try {
    const complaint = await findComplaintByIdOrLegacy(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
    
    // Same access control as GET /:id - handle both populated objects and ID strings
    const citizenId = typeof complaint.citizen === 'object' ? complaint.citizen?._id?.toString() : complaint.citizen?.toString();
    const officerId = typeof complaint.assignedOfficer === 'object' ? complaint.assignedOfficer?._id?.toString() : complaint.assignedOfficer?.toString();
    
    const isAdmin = req.userRole === 'admin';
    const isCitizen = req.userRole === 'citizen' && citizenId === req.userId;
    const isAssignedOfficer = req.userRole === 'officer' && officerId === req.userId;
    
    if (!isAdmin && !isCitizen && !isAssignedOfficer) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: complaint.timeline || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
