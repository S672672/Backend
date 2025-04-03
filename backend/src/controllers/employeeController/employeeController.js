const Employee = require('@/models/employee/employee');
const Leave = require('@/models/employee/Leave');
const multer = require('multer');

// Assuming multer is configured elsewhere, e.g.:
// const upload = multer({ dest: 'uploads/' });

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Get current month and year (e.g., "April-2025")
    const now = new Date();
    const currentMonthYear = `${now.toLocaleString('default', { month: 'long' })}-${now.getFullYear()}`;
    const monthlySalary = employee.totalYearlySalary / 12;

    // Check current month's salary status
    const currentMonthData = employee.monthlySalaryReceived.get(currentMonthYear) || {
      salary: 0,
      status: 'Pending',
      receivedDate: null,
    };
    const currentMonthStatus = {
      month: currentMonthYear,
      salary: monthlySalary,
      status: currentMonthData.status,
      receivedDate: currentMonthData.receivedDate,
    };

    // Process all monthly salary data
    const salaryDetails = [];
    for (const [month, data] of employee.monthlySalaryReceived.entries()) {
      salaryDetails.push({
        month,
        salaryReceived: data.salary,
        status: data.status,
        receivedDate: data.receivedDate,
      });
    }

    // Calculate remaining salary
    const totalRemainingSalary = employee.totalYearlySalary - employee.totalSalaryReceived;

    // Fetch and organize leaves month-wise
    const leaves = await Leave.find({ employeeId: employee._id });
    const leavesByMonth = {};
    leaves.forEach((leave) => {
      const leaveMonthYear = `${leave.date.toLocaleString('default', { month: 'long' })}-${leave.date.getFullYear()}`;
      if (!leavesByMonth[leaveMonthYear]) leavesByMonth[leaveMonthYear] = [];
      leavesByMonth[leaveMonthYear].push({
        date: leave.date,
        reason: leave.reason,
      });
    });

    res.status(200).json({
      employee: {
        name: employee.name,
        photo: employee.photo,
        department: employee.department,
        shift: employee.shift,
        totalYearlySalary: employee.totalYearlySalary,
        totalSalaryReceived: employee.totalSalaryReceived,
        leavesTaken: employee.leavesTaken,
      },
      currentMonthSalary: currentMonthStatus,
      salaryDetails, // All salary months for "View Details"
      totalRemainingSalary,
      leavesByMonth, // Month-wise leaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, department, shift, totalYearlySalary } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newEmployee = new Employee({
      name,
      photo,
      department,
      shift,
      totalYearlySalary,
      monthlySalaryReceived: new Map(), // Correct field name and type
      totalSalaryReceived: 0, // Correct field name
      salaryStatus: 'Pending', // Correct field name
      leavesTaken: 0,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateEmployeeShift = async (req, res) => {
  try {
    const { shift } = req.body;
    const employee = await Employee.findByIdAndUpdate(req.params.id, { shift }, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.addEmployeeLeave = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const newLeave = new Leave({
      employeeId: employee._id,
      date,
      reason,
    });

    await newLeave.save();
    employee.leavesTaken += 1;
    await employee.save();

    res.status(201).json(newLeave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.payEmployeeSalary = async (req, res) => {
  try {
    const { month, amount } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const existingMonthData = employee.monthlySalaryReceived.get(month);
    if (existingMonthData && existingMonthData.status === 'Paid') {
      return res.status(400).json({ message: `Salary for ${month} already paid` });
    }

    const monthlySalary = amount || employee.totalYearlySalary / 12; // Use provided amount or default
    employee.monthlySalaryReceived.set(month, {
      salary: monthlySalary,
      status: 'Paid',
      receivedDate: new Date(),
    });
    employee.totalSalaryReceived += monthlySalary;

    employee.salaryStatus = employee.totalSalaryReceived >= employee.totalYearlySalary ? 'Paid' : 'Pending';
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.UpdateEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, shift, totalYearlySalary } = req.body;
    const photo = req.file ? req.file.filename : undefined;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        department,
        shift,
        totalYearlySalary,
        ...(photo && { photo }), // Only update photo if provided
      },
      { new: true }
    );

    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.updateSalaryStatus = async (req, res) => {
  try {
    const { month, status, receivedDate } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const monthlySalary = employee.totalYearlySalary / 12;
    if (status === 'Paid') {
      employee.monthlySalaryReceived.set(month, {
        salary: monthlySalary,
        status: 'Paid',
        receivedDate: new Date(receivedDate || Date.now()),
      });
      employee.totalSalaryReceived += monthlySalary;
    } else {
      employee.monthlySalaryReceived.set(month, {
        salary: 0,
        status: 'Pending',
        receivedDate: null,
      });
      employee.totalSalaryReceived -= monthlySalary; // Adjust if previously paid
      if (employee.totalSalaryReceived < 0) employee.totalSalaryReceived = 0; // Prevent negative
    }

    employee.salaryStatus = employee.totalSalaryReceived >= employee.totalYearlySalary ? 'Paid' : 'Pending';
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};