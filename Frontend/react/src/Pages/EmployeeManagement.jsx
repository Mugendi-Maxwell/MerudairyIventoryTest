import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeManagementPage.css';

// ✅ Import toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "http://localhost:5000";

const EmployeeManagementPage = () => {
  const [activeTab, setActiveTab] = useState('addEmployee');

  // Data
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    created_by: ''
  });

  const [locationForm, setLocationForm] = useState({
    county: '',
    office: '',               
    createdByType: 'user', 
    createdById: ''
  });

  // === Fetchers ===
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE}/employees`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.employees || [];
      const sorted = data.sort((a, b) => (b.id || 0) - (a.id || 0));
      setEmployees(sorted);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error("❌ Failed to load employees");
      setEmployees([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/departments`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.departments || [];
      const sorted = data.sort((a, b) => (b.id || 0) - (a.id || 0));
      setDepartments(sorted);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error("❌ Failed to load departments");
      setDepartments([]);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/locations`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.locations || [];
      const sorted = data.sort((a, b) => (b.id || 0) - (a.id || 0));
      setLocations(sorted);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error("❌ Failed to load locations");
      setLocations([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("❌ Failed to load users");
      setUsers([]);
    }
  };

  // Load data initially
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchLocations();
  }, []);

  // Extra: when tab switches
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'addEmployee') {
      fetchEmployees();
      fetchDepartments();
    } else if (tab === 'addDepartment') {
      fetchDepartments();
    } else if (tab === 'addLocation') {
      fetchUsers();
      fetchEmployees();
      fetchLocations();
    }
  };

  // === Input Handlers ===
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  const handleDepartmentChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm({ ...departmentForm, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm({ ...locationForm, [name]: value });
  };

  // === Submits ===
  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/employees`, employeeForm);
      toast.success("✅ Employee added successfully");
      setEmployeeForm({ name: '', email: '', phone: '', department: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error("❌ Failed to add employee");
    }
  };

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/departments`, departmentForm);
      toast.success("✅ Department added successfully");
      setDepartmentForm({ name: '', created_by: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error("❌ Failed to add department");
    }
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();

    const payload = {
      county: locationForm.county,
      office: locationForm.office,  
      created_by_user_id:
        locationForm.createdByType === 'user' ? locationForm.createdById : null,
      created_by_employee_id:
        locationForm.createdByType === 'employee' ? locationForm.createdById : null
    };

    try {
      await axios.post(`${API_BASE}/locations`, payload);
      toast.success("✅ Location added successfully");
      setLocationForm({ county: '', office: '', createdByType: 'user', createdById: '' });
      fetchLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error("❌ Failed to add location");
    }
  };

  return (
    <div className="employee-management-page">
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'addEmployee' ? 'active' : ''}`}
          onClick={() => handleTabClick('addEmployee')}
        >
          Employees
        </button>
        <button
          className={`tab-button ${activeTab === 'addDepartment' ? 'active' : ''}`}
          onClick={() => handleTabClick('addDepartment')}
        >
          Departments
        </button>
        <button
          className={`tab-button ${activeTab === 'addLocation' ? 'active' : ''}`}
          onClick={() => handleTabClick('addLocation')}
        >
          Locations
        </button>
      </div>

      {/* === EMPLOYEE TAB === */}
      {activeTab === 'addEmployee' && (
        <div className="tab-content">
          <h2>Add New Employee</h2>
          <form onSubmit={handleSubmitEmployee} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={employeeForm.name} onChange={handleEmployeeChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={employeeForm.email} onChange={handleEmployeeChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input type="text" name="phone" value={employeeForm.phone} onChange={handleEmployeeChange} required />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <select name="department" value={employeeForm.department} onChange={handleEmployeeChange} required>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Add Employee</button>
          </form>

          <h3>Current Employees</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.department?.name || "Unknown"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === DEPARTMENT TAB === */}
      {activeTab === 'addDepartment' && (
        <div className="tab-content">
          <h2>Add New Department</h2>
          <form onSubmit={handleSubmitDepartment} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={departmentForm.name} onChange={handleDepartmentChange} required />
            </div>
            <div className="form-group">
              <label>Created By:</label>
              <input type="text" name="created_by" value={departmentForm.created_by} onChange={handleDepartmentChange} required />
            </div>
            <button type="submit" className="submit-button">Add Department</button>
          </form>

          <h3>Current Departments</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>{dept.name}</td>
                    <td>{dept.created_by}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2">No departments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* === LOCATION TAB === */}
      {activeTab === 'addLocation' && (
        <div className="tab-content">
          <h2>Add New Location</h2>
          <form onSubmit={handleSubmitLocation} className="employee-form">
            <div className="form-group">
              <label>County:</label>
              <input
                type="text"
                name="county"
                value={locationForm.county}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Office:</label>   
              <input
                type="text"
                name="office"
                value={locationForm.office}
                onChange={handleLocationChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Created By:</label>
              <select
                name="createdByType"
                value={locationForm.createdByType}
                onChange={handleLocationChange}
              >
                <option value="user">User</option>
                <option value="employee">Employee</option>
              </select>

              <select
                name="createdById"
                value={locationForm.createdById}
                onChange={handleLocationChange}
                required
              >
                <option value="">Select {locationForm.createdByType}</option>
                {locationForm.createdByType === "user"
                  ? users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (User)
                      </option>
                    ))
                  : employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} (Employee)
                      </option>
                    ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Add Location</button>
          </form>

          <h3>Current Locations</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>County</th>
                <th>Office</th>     
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {locations.length > 0 ? (
                locations.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.county}</td>
                    <td>{loc.office || "N/A"}</td>   
                    <td>{loc.created_by || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No locations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Toast container for alerts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EmployeeManagementPage;
