import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './issuedInventory.css';

const API_BASE = "http://localhost:5000";

const IssuedInventoryPage = () => {
  const [issuedItems, setIssuedItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [returns, setReturns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '', description: '' });
  const [activeTab, setActiveTab] = useState('issued');

  // For popup confirm modal
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    employeeId: null,
    locationId: null,
    inventoryId: null,
    employeeName: '',
    inventoryName: '',
  });

  // ---------- Fetch Issued Inventory + Locations ----------
  const fetchIssuedInventory = async () => {
    try {
      const [assignRes, locRes] = await Promise.all([
        axios.get(`${API_BASE}/assignments`),
        axios.get(`${API_BASE}/locations`)
      ]);

      const assignments = Array.isArray(assignRes.data)
        ? assignRes.data
        : assignRes.data.assigned_employees || [];

      const locData = Array.isArray(locRes.data)
        ? locRes.data
        : locRes.data.locations || [];

      setIssuedItems(assignments);
      setLocations(locData);
    } catch (error) {
      console.error('Error fetching issued inventory:', error);
      setIssuedItems([]);
      setLocations([]);
    }
  };

  // ---------- Fetch Employees ----------
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/employees`);
      setEmployees(Array.isArray(res.data) ? res.data : res.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  // ---------- Fetch Returns ----------
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${API_BASE}/returns`);
      setReturns(Array.isArray(res.data) ? res.data : res.data.returns || []);
    } catch (error) {
      console.error('Error fetching returns:', error);
      setReturns([]);
    }
  };

  // ---------- Fetch Categories ----------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/categories`);
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchIssuedInventory();
    fetchEmployees();
    fetchReturns();
    fetchCategories();
  }, []);

  // ---------- Handle Category Form ----------
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({ ...categoryForm, [name]: value });
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        // Update category
        await axios.put(`${API_BASE}/api/categories/${categoryForm.id}`, {
          name: categoryForm.name,
          description: categoryForm.description,
        });
        toast.success('✅ Category updated successfully!');
      } else {
        // Add new category
        await axios.post(`${API_BASE}/api/categories`, categoryForm);
        toast.success('✅ Category added successfully!');
      }

      setCategoryForm({ id: null, name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('❌ Failed to save category.');
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      description: cat.description,
    });
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${API_BASE}/api/categories/${id}`);
      toast.success('✅ Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('❌ Failed to delete category.');
    }
  };

  // ---------- Handle Return Action ----------
  const confirmReturn = (employeeId, locationId, inventoryId, employeeName, inventoryName) => {
    setConfirmPopup({
      show: true,
      employeeId,
      locationId,
      inventoryId,
      employeeName,
      inventoryName,
    });
  };

  const handleReturn = async () => {
    const { employeeId, locationId, inventoryId, employeeName, inventoryName } = confirmPopup;

    try {
      await axios.post(`${API_BASE}/returns`, {
        employee_id: employeeId,
        location_id: locationId,
        inventory_id: inventoryId,
      });

      toast.success(`✅ ${employeeName}'s "${inventoryName}" has been successfully returned!`);

      setIssuedItems(prev =>
        prev.filter(item => {
          const empId = item.employee?.id || item.employee_id;
          const locId = item.location?.id || item.location_id;
          const invId = item.inventory_item?.id || item.inventory_item_id;

          return !(empId === employeeId && locId === locationId && invId === inventoryId);
        })
      );

      fetchReturns();
      setConfirmPopup({ show: false });
    } catch (error) {
      console.error('Error adding return:', error);
      toast.error("❌ Oops! Something went wrong while processing the return.");
    }
  };

  return (
    <div className="issued-inventory-page">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* ---------- Tabs ---------- */}
      <div className="tab-container">
        <button className={`tab-button ${activeTab === 'issued' ? 'active' : ''}`} onClick={() => setActiveTab('issued')}>
          Issued Inventory
        </button>
        <button className={`tab-button ${activeTab === 'addCategory' ? 'active' : ''}`} onClick={() => setActiveTab('addCategory')}>
          Manage Categories
        </button>
        <button className={`tab-button ${activeTab === 'returns' ? 'active' : ''}`} onClick={() => setActiveTab('returns')}>
          Returns
        </button>
      </div>

      {/* ---------- Issued Inventory Table ---------- */}
      {activeTab === 'issued' && (
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Inventory Name</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issuedItems.length > 0 ? (
                issuedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.employee ? item.employee.name : `Employee #${item.employee_id}`}</td>
                    <td>{item.inventory_item ? item.inventory_item.name : item.inventory_item_name || "N/A"}</td>
                    <td>{item.location ? item.location.county : locations.find((loc) => loc.id === item.location_id)?.county || "Unknown"}</td>
                    <td>
                      <button
                        className="submit-button"
                        onClick={() =>
                          confirmReturn(
                            item.employee?.id || item.employee_id,
                            item.location?.id || item.location_id,
                            item.inventory_item?.id || item.inventory_item_id,
                            item.employee?.name || `Employee #${item.employee_id}`,
                            item.inventory_item?.name || item.inventory_item_name || "Inventory"
                          )
                        }
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No issued inventory found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Manage Categories ---------- */}
      {activeTab === 'addCategory' && (
        <div className="form-container">
          <h2>{categoryForm.id ? "Update Category" : "Add New Category"}</h2>
          <form onSubmit={handleSubmitCategory} className="employee-form">
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={categoryForm.name} onChange={handleCategoryInputChange} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={categoryForm.description} onChange={handleCategoryInputChange} required />
            </div>
            <button type="submit" className="submit-button">{categoryForm.id ? "Update Category" : "Add Category"}</button>
          </form>

          {/* Category Table */}
          <div className="table-container">
            <h3>Existing Categories</h3>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.name}</td>
                      <td>{cat.description}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEditCategory(cat)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3">No categories found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------- Returns Tab ---------- */}
      {activeTab === 'returns' && (
        <div className="table-container">
          <h2>Returns</h2>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Location</th>
                <th>Inventory</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((ret, index) => (
                  <tr key={index}>
                    <td>{ret.employee?.name || "Unknown Employee"}</td>
                    <td>{ret.location?.county || "Unknown Location"}</td>
                    <td>{ret.inventory_item?.name || "Unknown Inventory"}</td>
                    <td>{new Date(ret.return_date).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4">No returns found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Confirmation Popup ---------- */}
      {confirmPopup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Confirm Return</h3>
            <p>
              Are you sure you want to return <strong>{confirmPopup.inventoryName}</strong> 
              assigned to <strong>{confirmPopup.employeeName}</strong>?
            </p>
            <div className="popup-actions">
              <button className="cancel-button" onClick={() => setConfirmPopup({ show: false })}>Cancel</button>
              <button className="submit-button" onClick={handleReturn}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuedInventoryPage;
