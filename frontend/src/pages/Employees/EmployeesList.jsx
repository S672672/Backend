import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8888/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '26px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#333',
        }}
      >
        📋 Employees List
      </h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or department"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '20px',
          fontSize: '16px',
          boxSizing: 'border-box',
        }}
      />

      <button
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          margin: 'auto',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: '0.3s',
        }}
        onClick={() => navigate('/employees/create')}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
      >
        ➕ Add New Employee
      </button>

      {/* Employees List */}
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <li
              key={employee._id}
              style={{
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '15px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: '0.3s',
                borderLeft: '5px solid #4CAF50',
              }}
              onClick={() => navigate(`/employees/profile/${employee._id}`)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div>
                <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold', color: '#222' }}>
                  {employee.name}
                </h3>
                <p style={{ margin: '6px 0 0', fontSize: '16px', color: '#555' }}>
                  <strong>Department:</strong> {employee.department} | <strong>Shift:</strong>{' '}
                  {employee.shift}
                </p>
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#4CAF50',
                  backgroundColor: '#e8f5e9',
                  padding: '6px 12px',
                  borderRadius: '5px',
                }}
              >
                View ➡️
              </span>
            </li>
          ))
        ) : (
          <li style={{ padding: '20px', textAlign: 'center', fontSize: '18px', color: '#555' }}>
            No employees found matching the search.
          </li>
        )}
      </ul>
    </div>
  );
};

export default EmployeeList;
