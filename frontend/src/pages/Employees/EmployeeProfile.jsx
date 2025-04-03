import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '@/components/Backbutton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [showPayForm, setShowPayForm] = useState(false);
  const [leaveSort, setLeaveSort] = useState({ field: 'date', order: 'desc' });
  const [salarySort, setSalarySort] = useState({ field: 'month', order: 'desc' });
  const [leaveYearFilter, setLeaveYearFilter] = useState('All');
  const [leaveMonthFilter, setLeaveMonthFilter] = useState('All');
  const [salaryYearFilter, setSalaryYearFilter] = useState('All');
  const [salaryMonthFilter, setSalaryMonthFilter] = useState('All');

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

  const applyHoverEffects = () => {
    document.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        if (btn.style.backgroundColor === styles.actionButton.backgroundColor) {
          Object.assign(btn.style, styles.actionButtonHover);
        } else if (btn.style.backgroundColor === styles.submitButton.backgroundColor) {
          Object.assign(btn.style, styles.submitButtonHover);
        } else if (btn.style.backgroundColor === styles.editButton.backgroundColor) {
          Object.assign(btn.style, styles.editButtonHover);
        } else if (btn.style.backgroundColor === styles.sortButton.backgroundColor) {
          Object.assign(btn.style, styles.sortButtonHover);
        } else if (btn.style.backgroundColor === styles.closeButton.backgroundColor) {
          Object.assign(btn.style, styles.closeButtonHover);
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (btn.style.backgroundColor === styles.actionButtonHover.backgroundColor) {
          Object.assign(btn.style, styles.actionButton);
        } else if (btn.style.backgroundColor === styles.submitButtonHover.backgroundColor) {
          Object.assign(btn.style, styles.submitButton);
        } else if (btn.style.backgroundColor === styles.editButtonHover.backgroundColor) {
          Object.assign(btn.style, styles.editButton);
        } else if (btn.style.backgroundColor === styles.sortButtonHover.backgroundColor) {
          Object.assign(btn.style, styles.sortButton);
        } else if (btn.style.backgroundColor === styles.closeButtonHover.backgroundColor) {
          Object.assign(btn.style, styles.closeButton);
        }
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

  useEffect(() => {
    applyHoverEffects();
  }, [employee, showLeaveModal, showSalaryModal]);

  const handleUpdateEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append('name', employee.employee.name);
      formData.append('photo', imageFile || employee.employee.photo);
      formData.append('department', employee.employee.department);
      formData.append('shift', employee.employee.shift);
      formData.append('totalYearlySalary', employee.employee.totalYearlySalary);

      const response = await axios.put(`http://localhost:8888/employees/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setEmployee((prev) => ({ ...prev, ...response.data }));
      setIsEditing(false);
      toast.success('Employee details updated successfully!');
      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error.response?.data || error.message);
      toast.error(
        'Failed to update employee: ' + (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const handleAddLeave = async () => {
    if (!leaveDate || !leaveReason) {
      toast.error('Please provide both date and reason for the leave.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8888/employees/${id}/addLeave`, {
        date: leaveDate,
        reason: leaveReason,
      });
      const newLeave = response.data;
      const leaveMonthYear = `${new Date(newLeave.date).toLocaleString('default', {
        month: 'long',
      })}-${new Date(newLeave.date).getFullYear()}`;
      setEmployee((prev) => ({
        ...prev,
        employee: { ...prev.employee, leavesTaken: prev.employee.leavesTaken + 1 },
        leavesByMonth: {
          ...prev.leavesByMonth,
          [leaveMonthYear]: [
            ...(prev.leavesByMonth[leaveMonthYear] || []),
            { date: newLeave.date, reason: newLeave.reason },
          ],
        },
      }));
      setLeaveDate('');
      setLeaveReason('');
      setShowLeaveForm(false);
      toast.success('Leave added successfully!');
    } catch (error) {
      console.error('Error adding leave:', error.response?.data || error.message);
      toast.error('Failed to add leave: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handlePaySalary = async () => {
    if (!payAmount) {
      toast.error('Please enter an amount to pay.');
      return;
    }
    try {
      const currentMonthYear = employee.currentMonthSalary.month;
      const response = await axios.put(`http://localhost:8888/employees/${id}/pay`, {
        month: currentMonthYear,
        amount: Number(payAmount),
      });
      setEmployee((prev) => ({
        ...prev,
        currentMonthSalary: {
          ...prev.currentMonthSalary,
          status: 'Paid',
          receivedDate: response.data.monthlySalaryReceived[currentMonthYear].receivedDate,
          salary: Number(payAmount),
        },
        salaryDetails: [
          ...prev.salaryDetails,
          {
            month: currentMonthYear,
            salaryReceived: Number(payAmount),
            status: 'Paid',
            receivedDate: response.data.monthlySalaryReceived[currentMonthYear].receivedDate,
          },
        ],
        employee: {
          ...prev.employee,
          totalSalaryReceived: response.data.totalSalaryReceived,
        },
        totalRemainingSalary: response.data.totalYearlySalary - response.data.totalSalaryReceived,
      }));
      setPayAmount('');
      setShowPayForm(false);
      toast.success('Salary paid successfully!');
    } catch (error) {
      console.error('Error paying salary:', error.response?.data || error.message);
      toast.error('Failed to pay salary: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Sorting and Filtering Functions
  const getLeaveYears = () => {
    const years = new Set(Object.keys(employee.leavesByMonth).map((my) => my.split('-')[1]));
    return ['All', ...years];
  };

  const getLeaveMonths = (year) => {
    if (year === 'All')
      return [
        'All',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    const months = new Set(
      Object.keys(employee.leavesByMonth)
        .filter((my) => my.endsWith(year))
        .map((my) => my.split('-')[0])
    );
    return ['All', ...months];
  };

  const getSalaryYears = () => {
    const years = new Set(employee.salaryDetails.map((s) => s.month.split('-')[1]));
    return ['All', ...years];
  };

  const getSalaryMonths = (year) => {
    if (year === 'All')
      return [
        'All',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    const months = new Set(
      employee.salaryDetails.filter((s) => s.month.endsWith(year)).map((s) => s.month.split('-')[0])
    );
    return ['All', ...months];
  };

  const filterAndSortLeaves = (leaves) => {
    let flatLeaves = Object.entries(leaves).flatMap(([monthYear, leaveArray]) =>
      leaveArray.map((leave) => ({ ...leave, monthYear }))
    );

    if (leaveYearFilter !== 'All') {
      flatLeaves = flatLeaves.filter((l) => l.monthYear.endsWith(leaveYearFilter));
    }
    if (leaveMonthFilter !== 'All') {
      flatLeaves = flatLeaves.filter((l) => l.monthYear.startsWith(leaveMonthFilter));
    }

    return flatLeaves.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (leaveSort.field === 'date') {
        return leaveSort.order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (leaveSort.field === 'month') {
        return leaveSort.order === 'asc'
          ? a.monthYear.localeCompare(b.monthYear)
          : b.monthYear.localeCompare(a.monthYear);
      }
      return 0;
    });
  };

  const filterAndSortSalaries = (salaries) => {
    let filteredSalaries = [...salaries];
    if (salaryYearFilter !== 'All') {
      filteredSalaries = filteredSalaries.filter((s) => s.month.endsWith(salaryYearFilter));
    }
    if (salaryMonthFilter !== 'All') {
      filteredSalaries = filteredSalaries.filter((s) => s.month.startsWith(salaryMonthFilter));
    }

    return filteredSalaries.sort((a, b) => {
      if (salarySort.field === 'month') {
        return salarySort.order === 'asc'
          ? a.month.localeCompare(b.month)
          : b.month.localeCompare(a.month);
      } else if (salarySort.field === 'receivedDate') {
        const dateA = new Date(a.receivedDate);
        const dateB = new Date(b.receivedDate);
        return salarySort.order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  };

  const toggleLeaveSort = (field) => {
    setLeaveSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleSalarySort = (field) => {
    setSalarySort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (!employee) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton />
        <h1 style={styles.title}>Employee Profile</h1>
      </div>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <img
            src={`http://localhost:8888/uploads/employees/${employee.employee.photo}`}
            alt={employee.employee.name}
            style={styles.photo}
          />
          <div style={styles.textContainer}>
            <h2 style={styles.name}>{employee.employee.name}</h2>
            <p style={styles.info}>
              Department: <span>{employee.employee.department}</span>
            </p>
            <p style={styles.info}>
              Shift: <span>{employee.employee.shift}</span>
            </p>
          </div>
        </div>
        <div style={styles.detailsContainer}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Total Yearly Salary:</span>
            <span style={styles.detailValue}>${employee.employee.totalYearlySalary}</span>
          </div>

          {/* Leaves Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.detailLabel}>
                Leaves Taken: <strong>{employee.employee.leavesTaken}</strong>
              </span>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setShowLeaveForm(!showLeaveForm)}
                  style={styles.actionButton}
                >
                  {showLeaveForm ? 'Cancel' : 'Add Leave'}
                </button>
                <button onClick={() => setShowLeaveModal(true)} style={styles.actionButton}>
                  View Leaves
                </button>
              </div>
            </div>
            {showLeaveForm && (
              <div style={styles.formSection}>
                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  style={styles.input}
                  placeholder="Leave Date"
                />
                <input
                  type="text"
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  style={styles.input}
                  placeholder="Reason for Leave"
                />
                <button onClick={handleAddLeave} style={styles.submitButton}>
                  Submit Leave
                </button>
              </div>
            )}
          </div>

          {/* Salary Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.detailLabel}>
                Salary for {employee.currentMonthSalary.month}:{' '}
                <strong>{employee.currentMonthSalary.status}</strong>
              </span>
              <div style={styles.buttonGroup}>
                <button onClick={() => setShowPayForm(!showPayForm)} style={styles.actionButton}>
                  {showPayForm ? 'Cancel' : 'Pay Salary'}
                </button>
                <button onClick={() => setShowSalaryModal(true)} style={styles.actionButton}>
                  View Salary Details
                </button>
              </div>
            </div>
            {showPayForm && (
              <div style={styles.formSection}>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={styles.input}
                  placeholder="Amount to Pay"
                />
                <button onClick={handlePaySalary} style={styles.submitButton}>
                  Submit Payment
                </button>
              </div>
            )}
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Salary Remaining for This Year:</span>
              <span style={styles.detailValue}>${employee.totalRemainingSalary}</span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setIsEditing(!isEditing)} style={styles.editButton}>
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </button>

      {isEditing && (
        <div style={styles.editCard}>
          <h3 style={styles.sectionTitle}>Edit Employee Details</h3>
          <div style={styles.form}>
            <input
              type="text"
              value={employee.employee.name}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  employee: { ...employee.employee, name: e.target.value },
                })
              }
              placeholder="Name"
              style={styles.input}
            />
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            <input
              type="text"
              value={employee.employee.department}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  employee: { ...employee.employee, department: e.target.value },
                })
              }
              placeholder="Department"
              style={styles.input}
            />
            <select
              value={employee.employee.shift}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  employee: { ...employee.employee, shift: e.target.value },
                })
              }
              style={styles.select}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
            <input
              type="number"
              value={employee.employee.totalYearlySalary}
              onChange={(e) =>
                setEmployee({
                  ...employee,
                  employee: { ...employee.employee, totalYearlySalary: e.target.value },
                })
              }
              placeholder="Total Yearly Salary"
              style={styles.input}
            />
            <button onClick={handleUpdateEmployee} style={styles.submitButton}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.sectionTitle}>Leave History</h3>
            <div style={styles.filterControls}>
              <select
                value={leaveYearFilter}
                onChange={(e) => {
                  setLeaveYearFilter(e.target.value);
                  setLeaveMonthFilter('All'); // Reset month when year changes
                }}
                style={styles.select}
              >
                {getLeaveYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={leaveMonthFilter}
                onChange={(e) => setLeaveMonthFilter(e.target.value)}
                style={styles.select}
              >
                {getLeaveMonths(leaveYearFilter).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.sortControls}>
              <button onClick={() => toggleLeaveSort('month')} style={styles.sortButton}>
                Sort by Month{' '}
                {leaveSort.field === 'month' && (leaveSort.order === 'asc' ? '↑' : '↓')}
              </button>
              <button onClick={() => toggleLeaveSort('date')} style={styles.sortButton}>
                Sort by Date {leaveSort.field === 'date' && (leaveSort.order === 'asc' ? '↑' : '↓')}
              </button>
            </div>
            {Object.keys(employee.leavesByMonth).length > 0 ? (
              <div style={styles.modalContent}>
                {filterAndSortLeaves(employee.leavesByMonth).length > 0 ? (
                  filterAndSortLeaves(employee.leavesByMonth).map((leave, index) => (
                    <div key={index} style={styles.historyEntry}>
                      <span>Month: {leave.monthYear}</span> -
                      <span> Date: {new Date(leave.date).toLocaleDateString()}</span> -
                      <span> Reason: {leave.reason}</span>
                    </div>
                  ))
                ) : (
                  <p style={styles.noData}>No leaves found for selected filters.</p>
                )}
              </div>
            ) : (
              <p style={styles.noData}>No leaves taken yet.</p>
            )}
            <button onClick={() => setShowLeaveModal(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.sectionTitle}>Salary History</h3>
            <div style={styles.filterControls}>
              <select
                value={salaryYearFilter}
                onChange={(e) => {
                  setSalaryYearFilter(e.target.value);
                  setSalaryMonthFilter('All'); // Reset month when year changes
                }}
                style={styles.select}
              >
                {getSalaryYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={salaryMonthFilter}
                onChange={(e) => setSalaryMonthFilter(e.target.value)}
                style={styles.select}
              >
                {getSalaryMonths(salaryYearFilter).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.sortControls}>
              <button onClick={() => toggleSalarySort('month')} style={styles.sortButton}>
                Sort by Month{' '}
                {salarySort.field === 'month' && (salarySort.order === 'asc' ? '↑' : '↓')}
              </button>
              <button onClick={() => toggleSalarySort('receivedDate')} style={styles.sortButton}>
                Sort by Date{' '}
                {salarySort.field === 'receivedDate' && (salarySort.order === 'asc' ? '↑' : '↓')}
              </button>
            </div>
            {employee.salaryDetails.length > 0 ? (
              <div style={styles.modalContent}>
                {filterAndSortSalaries(employee.salaryDetails).length > 0 ? (
                  filterAndSortSalaries(employee.salaryDetails).map((salary, index) => (
                    <div key={index} style={styles.historyEntry}>
                      <span>Month: {salary.month}</span> -
                      <span> Amount: ${salary.salaryReceived}</span> -
                      <span> Status: {salary.status}</span> -
                      <span> Date: {new Date(salary.receivedDate).toLocaleDateString()}</span>
                    </div>
                  ))
                ) : (
                  <p style={styles.noData}>No salary records found for selected filters.</p>
                )}
              </div>
            ) : (
              <p style={styles.noData}>No salary records yet.</p>
            )}
            <button onClick={() => setShowSalaryModal(false)} style={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

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
    maxWidth: '1000px',
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
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#1a202c',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    marginBottom: '20px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  photo: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #e2e8f0',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2d3748',
    margin: '0 0 10px 0',
  },
  info: {
    fontSize: '1rem',
    color: '#4a5568',
    margin: '5px 0',
  },
  detailsContainer: {
    display: 'grid',
    gap: '20px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #edf2f7',
  },
  detailLabel: {
    fontSize: '1.1rem',
    color: '#718096',
  },
  detailValue: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#2d3748',
  },
  section: {
    padding: '15px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 16px',
    fontSize: '0.9rem',
    color: '#ffffff',
    backgroundColor: '#4a90e2',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  actionButtonHover: {
    backgroundColor: '#357abd',
    transform: 'translateY(-2px)',
  },
  formSection: {
    backgroundColor: '#f7fafc',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    marginBottom: '10px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  inputFocus: {
    borderColor: '#4a90e2',
    boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.2)',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#38a169',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  submitButtonHover: {
    backgroundColor: '#2f855a',
    transform: 'translateY(-2px)',
  },
  editButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#ed8936',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  editButtonHover: {
    backgroundColor: '#dd6b20',
    transform: 'translateY(-2px)',
  },
  editCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    marginTop: '20px',
  },
  form: {
    display: 'grid',
    gap: '15px',
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
  selectFocus: {
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
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#718096',
    padding: '50px 0',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    width: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContent: {
    marginTop: '15px',
  },
  filterControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  sortControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  sortButton: {
    padding: '6px 12px',
    fontSize: '0.9rem',
    color: '#4a5568',
    backgroundColor: '#edf2f7',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  sortButtonHover: {
    backgroundColor: '#e2e8f0',
  },
  historyEntry: {
    fontSize: '0.95rem',
    color: '#718096',
    padding: '10px 0',
    borderBottom: '1px solid #edf2f7',
  },
  noData: {
    fontSize: '0.95rem',
    color: '#a0aec0',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px 0',
  },
  closeButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#e53e3e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    width: '100%',
  },
  closeButtonHover: {
    backgroundColor: '#c53030',
    transform: 'translateY(-2px)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: '15px',
  },
};

export default EmployeeProfile;
