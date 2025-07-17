import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; 
import './inventory.css';

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const mockData = [
    { id: 1, name: "laptops", category: "Electronics", stock: 5 },
    { id: 2, name: "printers", category: "Electronics", stock: 100 },
    { id: 3, name: "Book", category: "Books", stock: 30 },
    { id: 4, name: "keyboards", category: "Home", stock: 8 },
    { id: 5, name: "Headphones", category: "Electronics", stock: 25 },
    { id: 6, name: "cpus", category: "Clothing", stock: 50 }
  ];

  useEffect(() => {
    setTimeout(() => {
      setItems(mockData);
      setFilteredItems(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="inventory-layout">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="inventory-main">
        <h1>Inventory</h1>

        <div className="inventory-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="inventory-stats">
          <span>Total Items: {filteredItems.length}</span>
          <span>Low Stock: {filteredItems.filter(item => item.stock < 10).length}</span>
        </div>

        <div className="inventory-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="inventory-card">
              <div className="inventory-card-header">
                <h3>{item.name}</h3>
                <span className="inventory-category">{item.category}</span>
              </div>
              <div className="inventory-card-footer">
                <span className="inventory-stock-price">{item.price || ''}</span>
                <span className={`inventory-stock ${item.stock < 10 ? 'low' : ''}`}>
                  {item.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
