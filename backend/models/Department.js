const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: { type: [String], default: [] },
  officerCount: { type: Number, default: 0 },
  openCount: { type: Number, default: 0 },
  resolvedCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
