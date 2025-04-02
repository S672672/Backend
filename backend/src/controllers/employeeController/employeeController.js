const Employee = require('@/models/employee/employee');
const multer = require('multer') 


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
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// exports.createEmployee = async (req, res) => {
//   try {
//     const { name, photo, department, shift, totalYearlySalary } = req.body;
//     const newEmployee = new Employee({
//       name,
//       photo,
//       department,
//       shift,
//       totalYearlySalary,
//       monthlySalaryRecieved: {},
//       totalSalaryRecieved: 0,
//       SalaryStatus: 'Pending',
//       leavesTaken: 0
//     });
//     await newEmployee.save();
//     res.status(201).json(newEmployee);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

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
      monthlySalaryRecieved: {},
      totalSalaryRecieved: 0,
      SalaryStatus: 'Pending',
      leavesTaken: 0
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
    const { leaves } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.leavesTaken += leaves;
    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


exports.payEmployeeSalary = async (req, res) => {
  try {
    const { month } = req.body;
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    if (employee.monthlySalaryRecieved.get(month)) {
      return res.status(400).json({ message: `salary for ${month} already paid` });
    }

    employee.monthlySalaryRecieved.set(month, true);
    employee.totalYearlySalary += employee.totalYearlySalary / 12;

    if (employee.totalSalaryRecieved >= employee.totalYearlySalary) {
      employee.salaryStatus = 'Paid';
    } else {
      employee.salaryStatus = 'Pending';
    }

    await employee.save();
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// exports.UpdateEmployeeDetails = async (req, res) => {
//     try {
//       const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
//       if (!employee) return res.status(404).json({ message: 'Employee not found' });
//       res.status(200).json(employee);
//     } catch (error) {
//       res.status(500).json({ message: 'Server Error', error });
//     }
//   };
  
exports.UpdateEmployeeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, shift, totalYearlySalary } = req.body;
    const photo = req.file ? req.file.filename : undefined;  // Check for new uploaded photo
    
    // Find and update employee details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        department,
        shift,
        totalYearlySalary,
        photo: photo || undefined,  // Only update the photo if it's provided
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
