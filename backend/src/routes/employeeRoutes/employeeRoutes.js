const express = require('express');
const router = express.Router();
const employeeController = require('@/controllers/employeeController/employeeController');
const upload = require('@/middlewares/uploadMiddleware/EmployeeUpload');

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/',upload.single('photo'), employeeController.createEmployee);
router.put('/:id/shift', employeeController.updateEmployeeShift);
router.post('/:id/addLeave', employeeController.addEmployeeLeave);
router.put('/:id/pay', employeeController.payEmployeeSalary);
router.put('/:id',upload.single('photo'), employeeController.UpdateEmployeeDetails);
router.put('/:id/salaryStatus', employeeController.updateSalaryStatus);

module.exports = router;
