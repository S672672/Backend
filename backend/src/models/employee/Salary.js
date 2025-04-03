// models/Employee.js
const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true }, // Store image URL
  department: { type: String, required: true },
  shift: { type: String, enum: ['Morning', 'Evening', 'Night'], required: true },
  salaryStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  totalYearlySalary: { type: Number, required: true }, 
  monthlySalaryReceived: { 
    type: Map, 
    of: { 
      salary: { type: Number }, 
      status: { type: String, enum: ['Paid', 'Pending'] }, 
      receivedDate: { type: Date } 
    }, 
    default: {} 
  }, 
  totalSalaryReceived: { type: Number, default: 0 },
  leavesTaken: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Employe', employeSchema);
