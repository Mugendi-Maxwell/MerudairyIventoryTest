import React, { useState, useEffect } from 'react';
import './inventory.css';
import axios from 'axios';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    category_id: '',
    description: '',
    brand: '',
    serialno: '',
    item_condition: ''
  });

  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedName, setUpdatedName] = useState('');

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory-items');
      const data = Array.isArray(response.data.inventory_items)
        ? response.data.inventory_items
        : [];
      setItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/inventory-items', newItem);
      fetchInventory();
      setNewItem({
        name: '',
        category_id: '',
        description: '',
        brand: '',
        serialno: '',
        item_condition: ''
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/inventory-items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/inventory-items/${id}`, {
        name: updatedName
      });
      const updatedItem = response.data;

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: updatedItem.name } : item))
      );

      setEditingItemId(null);
      setUpdatedName('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="inventory-layout">
      <div className="inventory-main">
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
          <button type="submit" className="btn btn-add">Add Item</button>
        </form>

        <div className="inventory-grid">
          {Array.isArray(items) &&
            items.map((item) => (
              <div key={item.id} className="inventory-card">
                <div className="inventory-card-header">
                  {editingItemId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        placeholder="New name"
                        className="edit-input"
                      />
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
                    </>
                  ) : (
                    <>
                      <h3>{item.name}</h3>
                      <span className="inventory-category">
                        {item.category_name || item.category_id}
                      </span>
                      <span
                        className={`inventory-availability ${
                          item.status === 'available' ? 'available' : 'not-available'
                        }`}
                      >
                        {item.status === 'available' ? 'Available' : 'Not Available'}
                      </span>
                      <p>Serial: {item.serialno || 'N/A'}</p>
                      <p>Condition: {item.item_condition || 'N/A'}</p>
                    </>
                  )}
                </div>
                <div className="inventory-card-footer">
                  {editingItemId !== item.id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingItemId(item.id);
                          setUpdatedName(item.name);
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
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
