import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './issuedInventory.css';

const IssuedInventoryPage = () => {
  const [activeTab, setActiveTab] = useState('issued');
  const [issuedItems, setIssuedItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    created_by: '' // fixed key to match backend
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'issued') {
      fetchIssuedInventory();
    } else if (tab === 'addEmployee') {
      fetchDepartments();
    }
  };

  const fetchIssuedInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory/issued');
      setIssuedItems(response.data);
    } catch (error) {
      console.error('Error fetching issued inventory:', error);
    }
  };

  const fetchDepartments = async () => {
  try {
    const response = await axios.get('http://localhost:5000/departments');
    console.log("Departments API response:", response.data);

    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.departments)
        ? response.data.departments
        : Array.isArray(response.data.data)
          ? response.data.data
          : [];

    setDepartments(data);
  } catch (error) {
    console.error('Error fetching departments:', error);
    setDepartments([]);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({ ...employeeForm, [name]: value });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };

  const handleDepartmentInputChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm({ ...departmentForm, [name]: value });
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/employees', employeeForm);
      alert('Employee added successfully');
      setEmployeeForm({ name: '', email: '', phone: '', department: '' });
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', categoryForm);
      alert('Category added successfully');
      setCategoryForm({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleSubmitDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/departments', departmentForm);
      alert('Department added successfully');
      setDepartmentForm({ name: '', created_by: '' });
      fetchDepartments(); 
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  useEffect(() => {
    fetchIssuedInventory();
  }, []);

  return (
    <div className="issued-inventory-page">
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'issued' ? 'active' : ''}`}
          onClick={() => handleTabClick('issued')}
        >
          Issued Inventory
        </button>
        <button
          className={`tab-button ${activeTab === 'addEmployee' ? 'active' : ''}`}
          onClick={() => handleTabClick('addEmployee')}
        >
          Add Employee
        </button>
        <button
          className={`tab-button ${activeTab === 'addCategory' ? 'active' : ''}`}
          onClick={() => handleTabClick('addCategory')}
        >
          Add Category
        </button>
        <button
          className={`tab-button ${activeTab === 'addDepartment' ? 'active' : ''}`}
          onClick={() => handleTabClick('addDepartment')}
        >
          Add Department
        </button>
      </div>

      {activeTab === 'issued' && (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Inventory ID</th>
                <th>Assigned By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {issuedItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.employeeName}</td>
                  <td>{item.inventoryId}</td>
                  <td>{item.assignedBy}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'issued' ? 'status-issued' : 'status-pending'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'addEmployee' && (
        <div className="form-container">
          <h2>Add New Employee</h2>
          <form onSubmit={handleSubmitEmployee} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={employeeForm.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={employeeForm.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input type="text" name="phone" value={employeeForm.phone} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <select name="department" value={employeeForm.department} onChange={handleInputChange} required>
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
        </div>
      )}

      {activeTab === 'addCategory' && (
        <div className="form-container">
          <h2>Add New Category</h2>
          <form onSubmit={handleSubmitCategory} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={categoryForm.name}
                onChange={handleCategoryInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={categoryForm.description}
                onChange={handleCategoryInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Add Category</button>
          </form>
        </div>
      )}

      {activeTab === 'addDepartment' && (
        <div className="form-container">
          <h2>Add New Department</h2>
          <form onSubmit={handleSubmitDepartment} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={departmentForm.name}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Created By:</label>
              <input
                type="text"
                name="created_by"
                value={departmentForm.created_by}
                onChange={handleDepartmentInputChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Add Department</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default IssuedInventoryPage;
