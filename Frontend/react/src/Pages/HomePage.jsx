import React, { useState, useEffect } from "react";
import "./Homepage.css";
import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

const InventoryHomepage = () => {
  // ---------- Issue Inventory state ----------
  const [formData, setFormData] = useState({
    employeeName: "",
    inventoryId: "",
    inventoryName: "",
    assignedBy: "",
    locationId: "",
  });

  // ---------- Create Location state ----------
  const [locationData, setLocationData] = useState({
    county: "",
    office: "",
    created_by: "",
  });

  // ---------- Data lists ----------
  const [employees, setEmployees] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [locations, setLocations] = useState([]);

  // ---------- Search states ----------
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");

  // ---------- Fetch data ----------
  useEffect(() => {
  const fetchAll = async () => {
    try {
      const [empRes, invRes, locRes] = await Promise.all([
        axios.get(`${API_BASE}/employees`),
        axios.get(`${API_BASE}/inventory-items`),
        axios.get(`${API_BASE}/locations`),
      ]);

      const employeesData = empRes.data;
      const inventoriesData = invRes.data;
      const locationsData = locRes.data;

      setEmployees(
        Array.isArray(employeesData)
          ? employeesData
          : Object.values(employeesData?.employees || {})
      );

      setInventories(
        Array.isArray(inventoriesData)
          ? inventoriesData
          : Object.values(inventoriesData?.inventory_items || {})
      );

      setLocations(
        Array.isArray(locationsData)
          ? locationsData
          : Object.values(locationsData?.locations || {})
      );
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setEmployees([]);
      setInventories([]);
      setLocations([]);
    }
  };

  fetchAll();
}, []);


  //avoid .filter/.map errors
  const employeesList = Array.isArray(employees) ? employees : [];
  const inventoriesList = Array.isArray(inventories) ? inventories : [];
  const locationsList = Array.isArray(locations) ? locations : [];

  // ---------- Handlers ----------
  const handleInventorySubmit = async () => {
    try {
      await axios.post(`${API_BASE}/issued-inventory`, formData);
      alert("Inventory issued successfully");
      setFormData({
        employeeName: "",
        inventoryId: "",
        inventoryName: "",
        assignedBy: "",
        locationId: "",
      });
    } catch (err) {
      console.error("Error issuing inventory:", err);
    }
  };

  const handleLocationSubmit = async () => {
    try {
      await axios.post(`${API_BASE}/locations`, {
        county: locationData.county,
        office: locationData.office,
        created_by: locationData.created_by,
      });
      alert("Location created successfully");
      setLocationData({ county: "", office: "", created_by: "" });

      try {
        const locRes = await axios.get(`${API_BASE}/locations`);
        const locationsData = locRes.data;
        setLocations(
          Array.isArray(locationsData)
            ? locationsData
            : Object.values(locationsData?.locations || locationsData || {})
        );
      } catch (refreshErr) {
        console.error("Error refreshing locations:", refreshErr);
      }
    } catch (err) {
      console.error("Error creating location:", err);
    }
  };

  return (
    <div className="inventory-layout">
      <div className="inventory-main">
        <h2 className="title">Issue Inventory</h2>

        {/* Employee Dropdown with Search */}
        <div className="form-group">
          <label className="label">Employee</label>
          <input
            type="text"
            className="input"
            placeholder="Search employee..."
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
          />
          <select
            className="input"
            value={formData.employeeName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, employeeName: e.target.value }))
            }
          >
            <option value="">Select Employee</option>
            {employeesList
              .filter((emp) =>
                (emp?.name ?? emp?.full_name ?? emp?.username ?? "")
                  .toLowerCase()
                  .startsWith(employeeSearch.toLowerCase())
              )
              .map((emp) => {
                const displayName =
                  emp?.name ?? emp?.full_name ?? emp?.username ?? `Emp #${emp?.id}`;
                return (
                  <option key={emp?.id ?? displayName} value={displayName}>
                    {displayName}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Inventory Dropdown with Search */}
        <div className="form-group">
          <label className="label">Inventory</label>
          <input
            type="text"
            className="input"
            placeholder="Search inventory..."
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
          />
          <select
            className="input"
            value={
              formData.inventoryId
                ? JSON.stringify({
                    id: formData.inventoryId,
                    name: formData.inventoryName,
                  })
                : ""
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  inventoryId: parsed.id,
                  inventoryName: parsed.name,
                }));
              } catch {
                setFormData((prev) => ({
                  ...prev,
                  inventoryId: "",
                  inventoryName: "",
                }));
              }
            }}
          >
            <option value="">Select Inventory</option>
            {inventoriesList
              .filter((inv) =>
                (inv?.name ?? "")
                  .toLowerCase()
                  .startsWith(inventorySearch.toLowerCase())
              )
              .map((inv) => (
                <option
                  key={inv.id}
                  value={JSON.stringify({ id: inv.id, name: inv.name })}
                >
                  {inv.name}
                </option>
              ))}
          </select>
        </div>

        {/* Location Dropdown with Search */}
        <div className="form-group">
          <label className="label">Location</label>
          <input
            type="text"
            className="input"
            placeholder="Search location..."
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
          <select
            className="input"
            value={formData.locationId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, locationId: e.target.value }))
            }
          >
            <option value="">Select Location</option>
            {locationsList
              .filter((loc) =>
                (loc?.county ?? loc?.name ?? "")
                  .toLowerCase()
                  .startsWith(locationSearch.toLowerCase())
              )
              .map((loc) => {
                const county = loc?.county ?? loc?.name ?? "Unknown County";
                const office = loc?.office ?? loc?.branch ?? "";
                const label = office ? `${county} - ${office}` : county;
                return (
                  <option key={loc?.id ?? label} value={loc?.id}>
                    {label}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="form-group full-width">
          <button onClick={handleInventorySubmit} className="button">
            Submit Issued Inventory
          </button>
        </div>

        <h2 className="title">Create Location</h2>

        {/* County */}
        <div className="form-group">
          <label className="label">County</label>
          <input
            type="text"
            className="input"
            value={locationData.county}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, county: e.target.value }))
            }
          />
        </div>

        {/* Office */}
        <div className="form-group">
          <label className="label">Office</label>
          <input
            type="text"
            className="input"
            value={locationData.office}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, office: e.target.value }))
            }
          />
        </div>

        {/* Created By Dropdown with Search */}
        <div className="form-group">
          <label className="label">Created By</label>
          <input
            type="text"
            className="input"
            placeholder="Search employee..."
            value={creatorSearch}
            onChange={(e) => setCreatorSearch(e.target.value)}
          />
          <select
            className="input"
            value={locationData.created_by}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, created_by: e.target.value }))
            }
          >
            <option value="">Select Employee</option>
            {employeesList
              .filter((emp) =>
                (emp?.name ?? emp?.full_name ?? emp?.username ?? "")
                  .toLowerCase()
                  .startsWith(creatorSearch.toLowerCase())
              )
              .map((emp) => {
                const label =
                  emp?.name ?? emp?.full_name ?? emp?.username ?? `Emp #${emp?.id}`;
                return (
                  <option key={emp?.id ?? label} value={emp?.id}>
                    {label}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="form-group full-width">
          <button onClick={handleLocationSubmit} className="button">
            Submit Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHomepage;
