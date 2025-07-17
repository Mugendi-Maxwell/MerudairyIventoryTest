// InventoryHomepage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Homepage.css';

const InventoryHomepage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('inventory');
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    email: '',
    itemName: '',
    itemCode: '',
    quantity: '',
    issueDate: '',
    returnDate: '',
    purpose: '',
    notes: ''
  });

  const handleNavClick = (navId) => {
    setActiveNav(navId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Inventory item issued successfully!');
  };

  const handleReset = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      email: '',
      itemName: '',
      itemCode: '',
      quantity: '',
      issueDate: '',
      returnDate: '',
      purpose: '',
      notes: ''
    });
  };

  return (
    <div className="container">
      <Sidebar activeNav={activeNav} onNavClick={handleNavClick} />

      <main className="main-content">
        <div className="form-container">
          <div className="form">
            <h2 className="section-title">Issue Inventory Item</h2>
            <div className="form-grid">
              {/* form fields */}
              <div className="form-group">
                <label className="label">Employee ID</label>
                <input className="input" type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
              </div>
              {/* ...remaining form fields... */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="label">Notes</label>
                <textarea className="textarea" name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
              </div>
            </div>
            <div className="form-actions">
              <button className="reset-button" onClick={handleReset}>Reset</button>
              <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryHomepage;
