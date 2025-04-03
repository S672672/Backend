import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import BackButton from '@/components/Backbutton';
import 'react-toastify/dist/ReactToastify.css';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    photo: null,
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
      photo: e.target.files[0],
    }));
  };

  // Create a new employee
  const handleCreateEmployee = async () => {
    if (!newEmployee.name || !newEmployee.department || !newEmployee.photo) {
      toast.error('Please fill all fields, including photo!');
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

      toast.success('Employee created successfully!');
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error.response || error.message);
      toast.error('Error creating employee. Please try again!');
    }
  };

  // Apply hover and focus effects dynamically
  useEffect(() => {
    const applyHoverEffects = () => {
      document.querySelectorAll('.submit-button').forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
          Object.assign(btn.style, styles.submitButtonHover);
        });
        btn.addEventListener('mouseleave', () => {
          Object.assign(btn.style, styles.submitButton);
        });
      });
      document.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('focus', () => {
          if (input.type !== 'file') {
            Object.assign(input.style, styles.inputFocus);
          } else {
            Object.assign(input.style, styles.fileInputHover);
          }
        });
        input.addEventListener('blur', () => {
          if (input.type !== 'file') {
            Object.assign(input.style, styles.input);
          } else {
            Object.assign(input.style, styles.fileInput);
          }
        });
      });
    };
    applyHoverEffects();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton />
        <h3 style={styles.title}>Create New Employee</h3>
      </div>
      <div style={styles.formContainer}>
        <div style={styles.form}>
          <input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleInputChange}
            placeholder="Enter Name"
            style={styles.input}
          />
          <input type="file" name="photo" onChange={handleFileChange} style={styles.fileInput} />
          <input
            type="text"
            name="department"
            value={newEmployee.department}
            onChange={handleInputChange}
            placeholder="Enter Department"
            style={styles.input}
          />
          <select
            name="shift"
            value={newEmployee.shift}
            onChange={handleInputChange}
            style={styles.select}
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
            style={styles.input}
          />
          <button
            className="submit-button"
            style={styles.submitButton}
            onClick={handleCreateEmployee}
          >
            Create Employee
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1a202c',
    margin: 0,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '30px',
  },
  form: {
    display: 'grid',
    gap: '15px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  inputFocus: {
    borderColor: '#4a90e2',
    boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.2)',
  },
  fileInput: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px dashed #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#f7fafc',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  fileInputHover: {
    borderColor: '#4a90e2',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#38a169',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontWeight: '600',
  },
  submitButtonHover: {
    backgroundColor: '#2f855a',
    transform: 'translateY(-2px)',
  },
};

export default CreateEmployee;
