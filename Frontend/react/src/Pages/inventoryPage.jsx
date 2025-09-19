import React, { useState, useEffect } from "react";
import "./inventory.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000";

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState("add"); // "add" or "issue"

  // ---------- Inventory Data ----------
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // search bar state

  // ---------- Add Inventory State ----------
  const [newItem, setNewItem] = useState({
    name: "",
    category_id: "",
    description: "",
    brand: "",
    serialno: "",
    item_condition: "",
  });

  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedSerial, setUpdatedSerial] = useState("");
  const [updatedCondition, setUpdatedCondition] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState(""); // for category update

  // ---------- Issue Inventory State ----------
  const [formData, setFormData] = useState({
    employeeId: "",
    inventoryId: "",
    inventoryName: "",
    locationId: "",
  });

  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // ---------- Fetch Initial Data ----------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [invRes, empRes, locRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/inventory-items`),
          axios.get(`${API_BASE}/employees`),
          axios.get(`${API_BASE}/locations`),
          axios.get(`${API_BASE}/api/categories`),
        ]);

        const fetchedCategories = Array.isArray(catRes.data) ? catRes.data : [];

        // Map items with category_name
        const itemsWithCategory = (invRes.data?.inventory_items || [])
          .map((item) => ({
            ...item,
            category_name:
              fetchedCategories.find(
                (cat) => Number(cat.id) === Number(item.category_id)
              )?.name || "Unknown",
          }))
          .sort((a, b) => b.id - a.id); // latest first

        setItems(itemsWithCategory);
        setEmployees(empRes.data?.employees || []);
        setLocations(locRes.data?.locations || []);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data!");
        setItems([]);
        setEmployees([]);
        setLocations([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ---------- Add Inventory Handlers ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/inventory-items`, newItem);
      // refetch items after adding
      const res = await axios.get(`${API_BASE}/inventory-items`);
      const itemsWithCategory = res.data?.inventory_items
        .map((item) => ({
          ...item,
          category_name:
            categories.find((cat) => Number(cat.id) === Number(item.category_id))
              ?.name || "Unknown",
        }))
        .sort((a, b) => b.id - a.id);
      setItems(itemsWithCategory);
      setNewItem({
        name: "",
        category_id: "",
        description: "",
        brand: "",
        serialno: "",
        item_condition: "",
      });
      toast.success("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/inventory-items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item!");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_BASE}/inventory-items/${id}`, {
        name: updatedName,
        serialno: updatedSerial,
        item_condition: updatedCondition,
        category_id: updatedCategory,
      });
      const updatedItem = response.data;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: updatedItem.name,
                serialno: updatedItem.serialno,
                item_condition: updatedItem.item_condition,
                category_id: updatedItem.category_id,
                category_name:
                  categories.find(
                    (cat) => Number(cat.id) === Number(updatedItem.category_id)
                  )?.name || "Unknown",
              }
            : item
        )
      );
      setEditingItemId(null);
      setUpdatedName("");
      setUpdatedSerial("");
      setUpdatedCondition("");
      setUpdatedCategory("");
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item!");
    }
  };

  // ---------- Issue Inventory Handlers ----------
  const handleInventorySubmit = async () => {
    try {
      await axios.post(`${API_BASE}/assignments`, {
        employee_id: formData.employeeId,
        inventory_item_id: formData.inventoryId,
        inventory_item_name: formData.inventoryName,
        location_id: formData.locationId,
      });
      toast.success("Inventory issued successfully!");
      setFormData({
        employeeId: "",
        inventoryId: "",
        inventoryName: "",
        locationId: "",
      });
      setEmployeeSearch("");
      setInventorySearch("");
      setLocationSearch("");
    } catch (err) {
      console.error("Error issuing inventory:", err);
      toast.error("Failed to issue inventory!");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  // ---------- Filtered items based on search ----------
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-layout">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="tab-buttons">
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Inventory
        </button>
        <button
          className={activeTab === "issue" ? "active" : ""}
          onClick={() => setActiveTab("issue")}
        >
          Issue Inventory
        </button>
      </div>

      <div className="inventory-main">
        {/* ----------- Add Inventory Tab ----------- */}
        {activeTab === "add" && (
          <>
            <form className="inventory-form" onSubmit={handleAddItem}>
              <h2>Add New Inventory</h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newItem.name}
                onChange={handleInputChange}
                required
              />
              <select
                name="category_id"
                value={newItem.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newItem.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={newItem.brand}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="serialno"
                placeholder="Serial Number"
                value={newItem.serialno}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="item_condition"
                placeholder="Condition"
                value={newItem.item_condition}
                onChange={handleInputChange}
              />
              <button type="submit" className="btn btn-add">
                Add Item
              </button>
            </form>

            {/* Inventory Search Bar */}
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />

            {/* Table View */}
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Serial No</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    {editingItemId === item.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            placeholder="New name"
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <select
                            value={updatedCategory}
                            onChange={(e) => setUpdatedCategory(e.target.value)}
                            className="edit-input"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedSerial}
                            onChange={(e) => setUpdatedSerial(e.target.value)}
                            placeholder="New serial"
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={updatedCondition}
                            onChange={(e) =>
                              setUpdatedCondition(e.target.value)
                            }
                            placeholder="New condition"
                            className="edit-input"
                          />
                        </td>
                        <td>—</td>
                        <td>
                          <button
                            onClick={() => handleUpdate(item.id)}
                            className="btn btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="btn btn-cancel"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.serialno || "N/A"}</td>
                        <td>{item.item_condition || "N/A"}</td>
                        <td
                          className={
                            item.status === "available"
                              ? "status-available"
                              : "status-unavailable"
                          }
                        >
                          {item.status === "available"
                            ? "Available"
                            : "Not Available"}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setEditingItemId(item.id);
                              setUpdatedName(item.name);
                              setUpdatedSerial(item.serialno || "");
                              setUpdatedCondition(item.item_condition || "");
                              setUpdatedCategory(item.category_id || "");
                            }}
                            className="btn btn-update"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ----------- Issue Inventory Tab ----------- */}
        {activeTab === "issue" && (
          <div className="issue-form">
            <h2>Issue Inventory</h2>

            {/* Employee Search */}
            <div className="form-group">
              <label>Employee</label>
              <input
                type="text"
                className="input"
                placeholder="Search employee..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
              {employeeSearch && (
                <ul className="dropdown-list">
                  {employees
                    .filter((emp) =>
                      (emp?.name ?? "")
                        .toLowerCase()
                        .includes(employeeSearch.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((emp) => (
                      <li
                        key={emp.id}
                        className="dropdown-item"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            employeeId: emp.id,
                          }));
                          setEmployeeSearch(emp.name);
                        }}
                      >
                        {emp.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Inventory Search */}
            <div className="form-group">
              <label>Inventory</label>
              <input
                type="text"
                className="input"
                placeholder="Search inventory..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
              />
              {inventorySearch && (
                <ul className="dropdown-list">
                  {items
                    .filter((inv) =>
                      inv.name
                        .toLowerCase()
                        .includes(inventorySearch.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((inv) => (
                      <li
                        key={inv.id}
                        className="dropdown-item"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            inventoryId: inv.id,
                            inventoryName: inv.name,
                          }));
                          setInventorySearch(inv.name);
                        }}
                      >
                        {inv.name}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Location Search */}
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="input"
                placeholder="Search location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
              {locationSearch && (
                <ul className="dropdown-list">
                  {locations
                    .filter((loc) =>
                      (loc.county ?? "")
                        .toLowerCase()
                        .includes(locationSearch.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((loc) => (
                      <li
                        key={loc.id}
                        className="dropdown-item"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            locationId: loc.id,
                          }));
                          setLocationSearch(loc.county);
                        }}
                      >
                        {loc.county}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="form-group full-width">
              <button onClick={handleInventorySubmit} className="button">
                Submit Issued Inventory
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
