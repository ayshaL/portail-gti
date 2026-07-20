import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { employees } from "./data/dashboardData";
import DashboardView from "./views/DashboardView";
import DetailView from "./views/DetailView";
import EmployeesView from "./views/EmployeesView";
import FilterEmployees from "./components/FilterEmployees";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = (nextView, employee) => {
    if (employee) setSelectedEmployee(employee);
    setView(nextView);
  };
  return (
    <div style={styles.shell}>
      <Sidebar
        view={view}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      {view === "dashboard" && (
        <DashboardView
          onNavigate={navigate}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
      {view === "employees" && (
        <EmployeesView
          onNavigate={navigate}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
      {view === "filtemp" && (
        <FilterEmployees
        // onNavigate={navigate}
        // sidebarCollapsed={sidebarCollapsed}
        />
      )}
      {view === "detail" && (
        <DetailView
          employee={selectedEmployee}
          onNavigate={navigate}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: '"DM Sans", sans-serif',
    color: "#172033",
    width: "100%",
  },
};
