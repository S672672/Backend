import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '@/components/Backbutton';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle the update form
  const [imageFile, setImageFile] = useState(null); // State to hold the selected file

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:8888/employees/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleUpdateEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append('name', employee.name);
      // If imageFile exists, append it, otherwise keep the old photo URL
      formData.append('photo', imageFile || employee.photo);
      formData.append('department', employee.department);
      formData.append('shift', employee.shift);
      formData.append('totalYearlySalary', employee.totalYearlySalary);
      formData.append('salaryStatus', employee.salaryStatus);

      const response = await axios.put(
        `http://localhost:8888/employees/${employee._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEmployee(response.data);
      setIsEditing(false); // Close the form after updating
      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected file to the state
  };

  if (!employee) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <BackButton />
      <h3 style={styles.title}>Employee Profile</h3>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          {/* Displaying photo */}
          <img
            src={`http://localhost:8888/uploads/employees/${employee.photo}`}
            alt={employee.name}
            style={styles.photo}
          />
          <div style={styles.textContainer}>
            <p style={styles.name}>{employee.name}</p>
            <p style={styles.department}>Department: {employee.department}</p>
            <p style={styles.shift}>Shift: {employee.shift}</p>
          </div>
        </div>
        <div style={styles.detailsContainer}>
          <p style={styles.detail}>
            Total Yearly Salary: <strong>${employee.totalYearlySalary}</strong>
          </p>
          <p style={styles.detail}>
            Leaves Taken: <strong>{employee.leavesTaken}</strong>
          </p>
          <p style={styles.detail}>
            Salary Status: <strong>{employee.salaryStatus}</strong>
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsEditing(!isEditing)} // Toggle the form visibility
        style={styles.button}
      >
        {isEditing ? 'Cancel' : 'Update Employee'}
      </button>

      {isEditing && ( // Render the form only if isEditing is true
        <div style={styles.formContainer}>
          <h4 style={styles.updateTitle}>Update Employee</h4>
          <div style={styles.form}>
            <input
              type="text"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              placeholder="Name"
              style={styles.input}
            />
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            <input
              type="text"
              value={employee.department}
              onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
              placeholder="Department"
              style={styles.input}
            />
            <select
              value={employee.shift}
              onChange={(e) => setEmployee({ ...employee, shift: e.target.value })}
              style={styles.select}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            <input
              type="number"
              value={employee.totalYearlySalary}
              onChange={(e) => setEmployee({ ...employee, totalYearlySalary: e.target.value })}
              placeholder="Total Yearly Salary"
              style={styles.input}
            />
            <button onClick={handleUpdateEmployee} style={styles.button}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '850px',
    margin: '40px auto',
    padding: '30px',
    background: '#f9fafb',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Roboto, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
  },
  photo: {
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    border: '5px solid #e0e0e0',
    marginRight: '20px',
  },
  textContainer: {
    textAlign: 'left',
  },
  name: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#34495e',
    margin: '0',
  },
  department: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  shift: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  detailsContainer: {
    marginTop: '25px',
  },
  detail: {
    fontSize: '1.3rem',
    color: '#95a5a6',
    marginBottom: '12px',
  },
  updateTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#34495e',
    marginBottom: '30px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '14px',
    fontSize: '1.2rem',
    border: '2px solid #bdc3c7',
    borderRadius: '10px',
    transition: 'border-color 0.3s ease',
    marginBottom: '15px',
  },
  select: {
    padding: '14px',
    fontSize: '1.2rem',
    border: '2px solid #bdc3c7',
    borderRadius: '10px',
    marginBottom: '15px',
  },
  fileInput: {
    fontSize: '1.2rem',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: '#f0f3f5',
    border: '2px dashed #bdc3c7',
    cursor: 'pointer',
  },
  button: {
    padding: '14px 25px',
    fontSize: '1.2rem',
    color: '#fff',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    transition: 'background-color 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#7f8c8d',
  },
};

export default EmployeeProfile;
