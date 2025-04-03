import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '@/components/Backbutton';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8888/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to fetch employees. Please try again later.');
      }
    };
    fetchEmployees();
  }, []);

  // Apply hover effects dynamically
  useEffect(() => {
    const applyHoverEffects = () => {
      document.querySelectorAll('.action-button').forEach((btn) => {
        btn.addEventListener('mouseenter', () => {
          Object.assign(btn.style, styles.actionButtonHover);
        });
        btn.addEventListener('mouseleave', () => {
          Object.assign(btn.style, styles.actionButton);
        });
      });
      document.querySelectorAll('.employee-card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          Object.assign(card.style, styles.employeeCardHover);
        });
        card.addEventListener('mouseleave', () => {
          Object.assign(card.style, styles.employeeCard);
        });
      });
      document.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('focus', () => {
          Object.assign(input.style, styles.inputFocus);
        });
        input.addEventListener('blur', () => {
          Object.assign(input.style, styles.input);
        });
      });
    };
    applyHoverEffects();
  }, [employees]);

  // Get unique shifts and departments for dropdowns
  const getUniqueShifts = () => {
    const shifts = new Set(employees.map((emp) => emp.shift));
    return ['All', ...shifts];
  };

  const getUniqueDepartments = () => {
    const departments = new Set(employees.map((emp) => emp.department));
    return ['All', ...departments];
  };

  // Filter employees based on search query, shift, and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShift = shiftFilter === 'All' || employee.shift === shiftFilter;
    const matchesDepartment =
      departmentFilter === 'All' || employee.department === departmentFilter;
    return matchesSearch && matchesShift && matchesDepartment;
  });

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex' }}>
        <BackButton />
        <h2 style={styles.title}> Employees List</h2>
      </div>

      {/* Filter Controls */}
      <div style={styles.filterControls}>
        <input
          type="text"
          placeholder="Search by name or department"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <select
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          style={styles.select}
        >
          {getUniqueShifts().map((shift) => (
            <option key={shift} value={shift}>
              {shift === 'All' ? 'All Shifts' : shift}
            </option>
          ))}
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          style={styles.select}
        >
          {getUniqueDepartments().map((dept) => (
            <option key={dept} value={dept}>
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Employee Button */}
      <button
        className="action-button"
        style={styles.actionButton}
        onClick={() => navigate('/employees/create')}
      >
        ➕ Add New Employee
      </button>

      {/* Employees List */}
      <ul style={styles.list}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <li
              key={employee._id}
              className="employee-card"
              style={styles.employeeCard}
              onClick={() => navigate(`/employees/profile/${employee._id}`)}
            >
              <div style={styles.employeeInfo}>
                <h3 style={styles.employeeName}>{employee.name}</h3>
                <p style={styles.employeeDetails}>
                  <strong>Department:</strong> {employee.department} | <strong>Shift:</strong>{' '}
                  {employee.shift}
                </p>
              </div>
              <span style={styles.viewBadge}>View ➡️</span>
            </li>
          ))
        ) : (
          <li style={styles.noResults}>No employees found matching the filters.</li>
        )}
      </ul>

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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: '30px',
  },
  filterControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap', // Allow wrapping on smaller screens
  },
  input: {
    flex: '1',
    minWidth: '200px',
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
  select: {
    flex: '1',
    minWidth: '150px',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  actionButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#4a90e2',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'block',
    margin: '0 auto 20px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontWeight: '600',
  },
  actionButtonHover: {
    backgroundColor: '#357abd',
    transform: 'translateY(-2px)',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  employeeCard: {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '15px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderLeft: '5px solid #4a90e2',
  },
  employeeCardHover: {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    margin: '0',
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  employeeDetails: {
    margin: '6px 0 0',
    fontSize: '0.95rem',
    color: '#718096',
  },
  viewBadge: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4a90e2',
    backgroundColor: '#ebf8ff',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#a0aec0',
    fontStyle: 'italic',
  },
};

export default EmployeeList;
