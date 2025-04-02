const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true }, // Store image URL
  department: { type: String, required: true },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
  salaryStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  totalYearlySalary: { type: Number, required: true }, 
  monthlySalaryRecieved: { type: Map, of: Boolean, default: {} }, // Tracks month-wise payments
  totalSalaryRecieved: { type: Number, default: 0 },
  leavesTaken: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
