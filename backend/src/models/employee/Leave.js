// models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Fixed typo
  date: { type: Date, required: true },
  reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);