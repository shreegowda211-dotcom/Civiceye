const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const socketHolder = require('../socket');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Enforce JWT_SECRET at module load time
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required');
}

function signToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function serializeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function authenticate(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/, '');
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userName = decoded.name;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

function requireRole(roleOrRoles) {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (roles.includes(req.userRole) || req.userRole === 'admin') {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  };
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 4) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const user = await User.findOne({ email }).populate('department', 'name').lean();
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = signToken(user);
  try {
    const activity = await Activity.create({
      userId: user._id,
      userRole: user.role,
      userName: user.name,
      action: 'login',
      target: user._id.toString(),
      targetType: 'user',
      message: `${user.name} logged in`,
    });
    const io = socketHolder.io;
    if (io) io.to('admins').emit('activity:new', activity);
  } catch (err) {
    console.warn('Failed to log login activity', err.message);
  }
  res.json({ success: true, token, user: serializeUser(user) });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, avatar } = req.body;
    if (!name || !email || !password || password.length < 4) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role: role || 'citizen', phone, avatar: avatar || null });
    await user.save();

    // create notifications for admins about new registration
    try {
      const admins = await User.find({ role: 'admin' }).lean();
      const notifs = await Promise.all(admins.map((a) => Notification.create({
        userId: a._id,
        title: 'New citizen registered',
        message: `${user.name} (${user.email}) has registered.`,
        link: `/admin/users/${user._id}`
      })));
      const io = socketHolder.io;
      if (io) {
        notifs.forEach((n) => {
          io.to(`user:${n.userId.toString()}`).emit('notification:new', n);
        });
        // also broadcast to admins room
        io.to('admins').emit('notification:new', { title: 'New citizen registered', message: `${user.name} has registered.` });
      }
    } catch (err) {
      console.warn('Failed to create admin notifications', err.message);
    }

      try {
        const activity = await Activity.create({
          userId: user._id,
          userRole: user.role,
          userName: user.name,
          action: 'user_registered',
          target: user._id.toString(),
          targetType: 'user',
          message: `${user.name} registered as ${user.role}`,
        });
        const io = socketHolder.io;
        if (io) io.to('admins').emit('activity:new', activity);
      } catch (err) {
        console.warn('Failed to log registration activity', err.message);
      }

    const token = signToken(user);
    res.json({ success: true, token, user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.userId).populate('department', 'name').lean();
  if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  res.json({ success: true, user: serializeUser(user) });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
});

router.patch('/profile', authenticate, async (req, res) => {
  try {
    const update = {};
    const { name, phone, avatar } = req.body;
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (avatar) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      try {
        const activity = await Activity.create({
          userId: user._id,
          userRole: user.role,
          userName: user.name,
          action: 'profile_updated',
          target: user._id.toString(),
          targetType: 'user',
          message: `${user.name} updated their profile`,
        });
        const io = socketHolder.io;
        if (io) io.to('admins').emit('activity:new', activity);
      } catch (err) {
        console.warn('Failed to log profile update activity', err.message);
      }

    res.json({ success: true, user: serializeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.authenticate = authenticate;
module.exports.requireRole = requireRole;
