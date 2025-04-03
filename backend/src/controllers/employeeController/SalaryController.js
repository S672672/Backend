// controllers/EmployeController.js
const Employe = require('../models/Employe');
const Leave = require('../models/Leave');

// Get all Employes
const getEmployes = async (req, res) => {
  try {
    const Employes = await Employe.find();
    res.status(200).json(Employes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific Employe's details, including monthly salary received and status
const getEmploye = async (req, res) => {
  try {
    const Employe = await Employe.findById(req.params.id);
    if (!Employe) return res.status(404).json({ message: 'Employe not found' });

    // Process monthly salary received data
    const salaryStatus = [];
    for (const [month, data] of Employe.monthlySalaryReceived.entries()) {
      salaryStatus.push({
        month,
        salaryReceived: data.salary,
        status: data.status
      });
    }

    // Calculate remaining salary for the year
    const totalRemainingSalary = Employe.totalYearlySalary - Employe.totalSalaryReceived;

    res.status(200).json({
      Employe,
      salaryStatus,
      totalRemainingSalary
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update salary status for a specific month
const updateSalaryStatus = async (req, res) => {
  try {
    const { month, status } = req.body;  // Month and status ('Paid' or 'Pending')
    const Employe = await Employe.findById(req.params.id);
    if (!Employe) return res.status(404).json({ message: 'Employe not found' });

    // If salary is paid, update the salary amount for that month
    if (status === 'Paid') {
      const monthlySalary = Employe.totalYearlySalary / 12; // Assuming equal monthly salary
      Employe.monthlySalaryReceived.set(month, { salary: monthlySalary, status: 'Paid' });

      // Update total salary received
      Employe.totalSalaryReceived += monthlySalary;
    } else {
      Employe.monthlySalaryReceived.set(month, { salary: 0, status: 'Pending' });
    }

    await Employe.save();
    res.status(200).json(Employe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a leave entry for an Employe
const addLeave = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const Employe = await Employe.findById(req.params.id);
    if (!Employe) return res.status(404).json({ message: 'Employe not found' });

    const newLeave = new Leave({
      EmployeId: Employe._id,
      date,
      reason
    });

    await newLeave.save();
    Employe.leavesTaken += 1;
    await Employe.save();
    
    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEmployes,
  getEmploye,
  updateSalaryStatus,
  addLeave
};
