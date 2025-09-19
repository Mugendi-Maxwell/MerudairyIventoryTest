import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Package, 
  MapPin, 
  Building, 
  Users, 
  RotateCcw, 
  Award,
  BarChart3
} from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import "./Homepage.css";

const API_BASE = "http://127.0.0.1:5000";

// Card Components (unchanged)
const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`card-description ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

// Stat Card Component (unchanged)
const StatCard = ({ title, value, icon: Icon, trend, description, className = "" }) => (
  <Card className={`stat-card ${className}`}>
    <CardContent className="stat-content">
      <div className="stat-header">
        <div className="stat-icon-wrapper">
          <Icon className="stat-icon" />
        </div>
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="stat-trend">
          <TrendingUp className="trend-icon" />
          <span className="trend-text">{trend}</span>
        </div>
      )}
      {description && <p className="stat-description">{description}</p>}
    </CardContent>
  </Card>
);

// Top Performers Component (unchanged)
const TopPerformersCard = ({ title, data, icon: Icon }) => (
  <Card className="top-performers-card">
    <CardHeader>
      <div className="performers-header">
        <Icon className="performers-icon" />
        <CardTitle>{title}</CardTitle>
      </div>
      <CardDescription>Highest activity rankings</CardDescription>
    </CardHeader>
    <CardContent>
      {data.length > 0 ? (
        <div className="performers-list">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="performer-item">
              <div className="performer-rank">{index + 1}</div>
              <div className="performer-info">
                <span className="performer-name">{item.name}</span>
                <span className="performer-count">{item.count} items</span>
              </div>
              <div className="performer-bar">
                <div 
                  className="performer-bar-fill"
                  style={{ width: `${(item.count / data[0]?.count) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No data available</p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Chart Container & RadialChart (unchanged)
const ChartContainer = ({ children, className = "" }) => (
  <div className={`chart-container ${className}`} 
       style={{ '--chart-1': '#667eea', '--chart-2': '#10b981', '--chart-3': '#f59e0b' }}>
    {children}
  </div>
);

const RadialChart = ({ data, title, description }) => (
  <Card className="radial-chart-card">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer className="radial-container">
        <RadialBarChart
          data={data}
          startAngle={90}
          endAngle={90 + (data[0]?.value / 100) * 360}
          innerRadius={60}
          outerRadius={90}
          width={200}
          height={200}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            polarRadius={[66, 54]}
          />
          <RadialBar 
            dataKey="value" 
            background={{ fill: '#f3f4f6' }}
            cornerRadius={8}
            fill="var(--chart-2)"
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="chart-percentage-text">
                        {data[0]?.value || 0}%
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="chart-label-text">
                        {data[0]?.label || 'Usage'}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

// Main Dashboard Component (logic updated)
const InventoryDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalInventories: 0,
    totalLocations: 0,
    topLocations: [],
    totalDepartments: 0,
    topDepartments: [],
    totalEmployees: 0,
    totalReturns: 0,
    totalIssued: 0,
    utilizationRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: extract inventory id from a return record (support different shapes)
  const getReturnedInventoryId = (r) => {
    // support keys: inventory_item_id, inventory_id, inventory_item (object), inventory (object)
    return (
      r.inventory_item_id ??
      r.inventory_id ??
      (r.inventory_item && (r.inventory_item.id ?? r.inventory_item.inventory_id)) ??
      (r.inventory && (r.inventory.id ?? r.inventory.inventory_id)) ??
      null
    );
  };

  // Helper: extract inventory id from an assignment (support different shapes)
  const getAssignmentInventoryId = (a) => {
    return (
      a.inventory_item_id ??
      a.inventory_id ??
      (a.inventory_item && (a.inventory_item.id ?? a.inventory_item.inventory_id)) ??
      (a.inventory && (a.inventory.id ?? a.inventory.inventory_id)) ??
      null
    );
  };

  // Helper: determine location name for an assignment
  const getLocationNameFromAssignment = (assignment, locationsList) => {
    // If assignment has nested location object
    const locObj = assignment.location ?? assignment.location_obj ?? assignment.location_item;
    if (locObj && typeof locObj === 'object') {
      // Prefer name if present, otherwise combine county + office if available
      if (locObj.name) return locObj.name;
      if (locObj.office && locObj.county) return `${locObj.county} - ${locObj.office}`;
      if (locObj.office) return locObj.office;
      if (locObj.county) return locObj.county;
    }

    // If assignment has a location_id, lookup in locationsList
    const locId = assignment.location_id ?? assignment.loc_id ?? null;
    if (locId != null && Array.isArray(locationsList)) {
      const found = locationsList.find(l => (l.id ?? l.location_id) === locId);
      if (found) {
        if (found.name) return found.name;
        if (found.office && found.county) return `${found.county} - ${found.office}`;
        if (found.office) return found.office;
        if (found.county) return found.county;
      }
    }

    // Fallbacks: check for a direct string field
    if (assignment.location_name) return assignment.location_name;
    if (assignment.location?.name) return assignment.location.name;

    return "Unknown";
  };

  // Helper: determine department name for an assignment
  const getDepartmentNameFromAssignment = (assignment, employeesList, departmentsList) => {
    // If assignment has nested employee object with department object or name
    const empObj = assignment.employee ?? assignment.employee_obj;
    if (empObj && typeof empObj === "object") {
      // employee.department might be an object or string
      if (empObj.department && typeof empObj.department === "object") {
        if (empObj.department.name) return empObj.department.name;
      }
      if (empObj.department && typeof empObj.department === "string") {
        return empObj.department;
      }
      // maybe employee has department_name directly
      if (empObj.department_name) return empObj.department_name;
      // maybe employee has department_id - we'll look it up below
      if (empObj.department_id != null) {
        const d = departmentsList.find(dep => (dep.id ?? dep.department_id) === empObj.department_id);
        if (d) return d.name ?? d.department_name ?? "Unknown";
      }
    }

    // If assignment has employee_id, look up employee then department
    const empId = assignment.employee_id ?? assignment.emp_id ?? null;
    if (empId != null && Array.isArray(employeesList)) {
      const foundEmp = employeesList.find(e => (e.id ?? e.employee_id) === empId);
      if (foundEmp) {
        // foundEmp.department might be an object or string or department_id
        if (foundEmp.department && typeof foundEmp.department === "object") {
          if (foundEmp.department.name) return foundEmp.department.name;
        }
        if (foundEmp.department && typeof foundEmp.department === "string") {
          return foundEmp.department;
        }
        if (foundEmp.department_id != null) {
          const d = departmentsList.find(dep => (dep.id ?? dep.department_id) === foundEmp.department_id);
          if (d) return d.name ?? d.department_name ?? "Unknown";
        }
      }
    }

    // fallback
    return "Unknown";
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        inventoryRes,
        assignmentsRes,
        locationsRes,
        departmentsRes,
        employeesRes,
        returnsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/inventory-items`),
        fetch(`${API_BASE}/assignments`),
        fetch(`${API_BASE}/locations`),
        fetch(`${API_BASE}/departments`),
        fetch(`${API_BASE}/employees`),
        fetch(`${API_BASE}/returns`)
      ]);

      // Parse main ones first and then optional ones
      const inventoryData = await inventoryRes.json();
      const assignmentsData = await assignmentsRes.json();

      let locationsData = [];
      let departmentsData = [];
      let employeesData = [];
      let returnsData = [];

      try { if (locationsRes.ok) locationsData = await locationsRes.json(); } catch (e) { /* ignore */ }
      try { if (departmentsRes.ok) departmentsData = await departmentsRes.json(); } catch (e) { /* ignore */ }
      try { if (employeesRes.ok) employeesData = await employeesRes.json(); } catch (e) { /* ignore */ }
      try { if (returnsRes.ok) returnsData = await returnsRes.json(); } catch (e) { /* ignore */ }

      const inventories = inventoryData?.inventory_items || inventoryData || [];
      const assignments = assignmentsData?.assigned_employees || assignmentsData || [];
      const locations = locationsData?.locations || locationsData || [];
      const departments = departmentsData?.departments || departmentsData || [];
      const employees = employeesData?.employees || employeesData || [];
      const returns = returnsData?.returns || returnsData || [];

      // Build set of returned inventory ids (normalize different shapes)
      const returnedIds = new Set();
      returns.forEach(r => {
        const id = getReturnedInventoryId(r);
        if (id != null) returnedIds.add(id);
      });

      // Filter active assignments (exclude returned inventories)
      const activeAssignments = assignments.filter(a => {
        const invId = getAssignmentInventoryId(a);
        // if assignment doesn't have an inventory id we keep it (can't prove returned),
        // but usually it will have one — still: safe fallback
        if (invId == null) return true;
        return !returnedIds.has(invId);
      });

      // Top locations (resolve name via nested object OR lookup by id)
      const locationCounts = {};
      activeAssignments.forEach(assignment => {
        const locName = getLocationNameFromAssignment(assignment, locations);
        locationCounts[locName] = (locationCounts[locName] || 0) + 1;
      });
      const topLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Top departments (resolve via employee -> department or lookups)
      const departmentCounts = {};
      activeAssignments.forEach(assignment => {
        const deptName = getDepartmentNameFromAssignment(assignment, employees, departments);
        departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
      });
      const topDepartments = Object.entries(departmentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Utilization
      const utilizationRate = inventories.length > 0
        ? Math.round((activeAssignments.length / inventories.length) * 100)
        : 0;

      setDashboardData({
        totalInventories: inventories.length,
        totalLocations: locations.length || Object.keys(locationCounts).length,
        topLocations,
        totalDepartments: departments.length || Object.keys(departmentCounts).length,
        topDepartments,
        totalEmployees: employees.length,
        totalReturns: returns.length,
        totalIssued: activeAssignments.length,
        utilizationRate
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 10s
    // Fetch once on mount
    // Fetch once on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);



  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
      </div>
    );
  }

  const utilizationChartData = [
    { 
      name: "utilization", 
      value: dashboardData.utilizationRate,
      label: "Used"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <BarChart3 className="title-icon" />
          Inventory Management Dashboard
        </h1>
        <p className="dashboard-subtitle">Real-time overview of your inventory system</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Inventory Items"
          value={dashboardData.totalInventories.toLocaleString()}
          icon={Package}
          description="All items in system"
          className="stat-primary"
        />
        
        <StatCard
          title="Total Locations"
          value={dashboardData.totalLocations.toLocaleString()}
          icon={MapPin}
          description="Active locations"
          className="stat-secondary"
        />
        
        <StatCard
          title="Total Departments"
          value={dashboardData.totalDepartments.toLocaleString()}
          icon={Building}
          description="Active departments"
          className="stat-accent"
        />
        
        <StatCard
          title="Total Employees"
          value={dashboardData.totalEmployees.toLocaleString()}
          icon={Users}
          description="Registered users"
          className="stat-success"
        />
        
        <StatCard
          title="Items Issued"
          value={dashboardData.totalIssued.toLocaleString()}
          icon={TrendingUp}
          description="Currently in use"
          className="stat-warning"
        />
        
        <StatCard
          title="Total Returns"
          value={dashboardData.totalReturns.toLocaleString()}
          icon={RotateCcw}
          description="Returned items"
          className="stat-info"
        />
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <RadialChart
          data={utilizationChartData}
          title="Inventory Utilization"
          description="Current usage percentage"
        />

        <TopPerformersCard
          title="Top Locations"
          data={dashboardData.topLocations}
          icon={Award}
        />

        <TopPerformersCard
          title="Top Departments"
          data={dashboardData.topDepartments}
          icon={Building}
        />
      </div>

      {/* Summary */}
      <div className="dashboard-summary">
        <Card className="summary-card">
          <CardContent>
            <div className="summary-content">
              <div className="summary-item">
                <span className="summary-label">Utilization Rate:</span>
                <span className="summary-value primary">{dashboardData.utilizationRate}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Available Items:</span>
                <span className="summary-value success">
                  {(dashboardData.totalInventories - dashboardData.totalIssued).toLocaleString()}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Top Location:</span>
                <span className="summary-value">
                  {dashboardData.topLocations[0]?.name || 'N/A'} 
                  ({dashboardData.topLocations[0]?.count || 0} items)
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Top Department:</span>
                <span className="summary-value">
                  {dashboardData.topDepartments[0]?.name || 'N/A'} 
                  ({dashboardData.topDepartments[0]?.count || 0} items)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
