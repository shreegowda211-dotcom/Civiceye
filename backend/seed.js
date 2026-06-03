require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Department = require('./models/Department');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Notification = require('./models/Notification');
const Setting = require('./models/Setting');
const mocks = require('./data/mocks');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civiceye';
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD || 'demo1234';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  const deptMap = {};
  for (const d of mocks.departments) {
    const doc = await Department.findOneAndUpdate(
      { name: d.name },
      {
        $setOnInsert: {
          name: d.name,
          description: d.description || '',
          categories: d.categories || [],
          officerCount: d.officerCount || 0,
          openCount: d.openCount || 0,
          resolvedCount: d.resolvedCount || 0,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    deptMap[d._id] = doc;
  }

  const userMap = {};
  for (const u of mocks.users) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const userDoc = await User.findOneAndUpdate(
      { email: u.email },
      {
        $setOnInsert: {
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          phone: u.phone,
          avatar: u.avatar || null,
          department: u.department ? deptMap[u.department._id]._id : undefined
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    userMap[u._id] = userDoc;
  }

  const complaintMap = {};
  for (const c of mocks.complaints) {
    const complaintDoc = await Complaint.findOneAndUpdate(
      { legacyId: c._id },
      {
        $setOnInsert: {
          legacyId: c._id,
          title: c.title,
          description: c.description,
          category: c.category,
          status: c.status,
          images: c.images || [],
          resolutionImages: c.resolutionImages || [],
          location: c.location || {},
          citizen: c.citizen ? userMap[c.citizen._id]._id : undefined,
          department: c.department ? deptMap[c.department._id]._id : undefined,
          assignedOfficer: c.assignedOfficer ? userMap[c.assignedOfficer._id]._id : null,
          timeline: c.timeline || []
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    complaintMap[c._id] = complaintDoc;
  }

  for (const n of mocks.notifications) {
    const user = userMap[n.userId];
    const complaint = n.link?.match(/c_\d+/)?.[0] ? complaintMap[n.link.match(/c_\d+/)[0]] : null;
    const link = complaint ? n.link.replace(/c_\d+/, complaint._id.toString()) : n.link;
    const exists = await Notification.findOne({
      userId: user ? user._id : undefined,
      title: n.title,
      link
    });
    if (!exists) {
      await Notification.create({
        userId: user ? user._id : undefined,
        title: n.title,
        message: n.message,
        link,
        read: n.read || false
      });
    }
  }

  const setting = await Setting.findOne();
  if (!setting) {
    await Setting.create({
      siteName: 'CivicEye',
      supportEmail: 'support@civiceye.app',
      autoRoutingEnabled: true,
      slaHours: 72,
      allowSelfRegistration: true,
    });
  }

  console.log('Seeding complete');
  console.log(`Default seeded user password: ${DEFAULT_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
