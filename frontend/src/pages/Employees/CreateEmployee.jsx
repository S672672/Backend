import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    photo: null, // Change photo to null to hold file object
    department: '',
    shift: 'Morning',
    totalYearlySalary: 0,
  });

  // Handle input change for creating new employee
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle photo file change
  const handleFileChange = (e) => {
    setNewEmployee((prevState) => ({
      ...prevState,
      photo: e.target.files[0], // Store the file object
    }));
  };

  // Create a new employee
  const handleCreateEmployee = async () => {
    if (!newEmployee.name || !newEmployee.department || !newEmployee.photo) {
      toast.error('Please fill all fields, including photo!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newEmployee.name);
      formData.append('photo', newEmployee.photo);
      formData.append('department', newEmployee.department);
      formData.append('shift', newEmployee.shift);
      formData.append('totalYearlySalary', newEmployee.totalYearlySalary);

      const response = await axios.post('http://localhost:8888/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Employee created successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error.response || error.message);
      toast.error('Error creating employee. Please try again!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="create-employee-container">
      <h3>Create New Employee</h3>
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={newEmployee.name}
          onChange={handleInputChange}
          placeholder="Enter Name"
          className="form-input"
        />
        <input type="file" name="photo" onChange={handleFileChange} className="form-input" />
        <input
          type="text"
          name="department"
          value={newEmployee.department}
          onChange={handleInputChange}
          placeholder="Enter Department"
          className="form-input"
        />
        <select
          name="shift"
          value={newEmployee.shift}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>
        <input
          type="number"
          name="totalYearlySalary"
          value={newEmployee.totalYearlySalary}
          onChange={handleInputChange}
          placeholder="Enter Total Yearly Salary"
          className="form-input"
        />
        <button onClick={handleCreateEmployee} className="submit-btn">
          Create Employee
        </button>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Inline CSS */}
      <style jsx>{`
        .create-employee-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background-color: #f4f6f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .create-employee-container h3 {
          text-align: center;
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-input {
          padding: 10px;
          margin: 10px 0;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-color: #4caf50;
          outline: none;
        }

        .submit-btn {
          background-color: #4caf50;
          color: white;
          padding: 12px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }

        .submit-btn:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default CreateEmployee;
