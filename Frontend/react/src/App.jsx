import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Pages/Sidebar';
import InventoryPage from './Pages/inventoryPage';
import HomePage from './Pages/HomePage';
import AdminInvite from './Pages/AdminInvite';
import IssuedInventoryPage from './Pages/IssuedInventory';
import AdminSignupPage from './Pages/Account';
import ErrorBoundary from './Pages/ErrorBoundary';
import EmployeeManagementPage from './Pages/EmployeeManagement';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/admin/invite" element={<AdminInvite />} />
              <Route path="/issued-inventory/" element={<IssuedInventoryPage />} />
              <Route path="/admin/signup" element={<AdminSignupPage />} />
              <Route path="/employees" element={<EmployeeManagementPage />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
}

export default App;
