const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  state: String,
  city: String,
  area: String,
  latitude: Number,
  longitude: Number,
  gps: { type: Boolean, default: false }
}, { _id: false });

const TimelineSchema = new mongoose.Schema({
  status: String,
  message: String,
  remarks: String,
  actor: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    name: String,
    role: String
  },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ComplaintSchema = new mongoose.Schema({
  legacyId: { type: String, index: true, unique: true, sparse: true },
  title: String,
  description: String,
  category: String,
  status: { type: String, default: 'pending' },
  images: [String],
  resolutionImages: [String],
  location: LocationSchema,
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  timeline: [TimelineSchema]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
