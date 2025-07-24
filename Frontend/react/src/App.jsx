import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Pages/Sidebar';
import InventoryPage from './Pages/inventoryPage';
import HomePage from './Pages/HomePage';
// import SettingsPage from './SettingsPage';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
