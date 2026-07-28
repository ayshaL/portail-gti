import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { employees as mockEmployees } from "./data/dashboardData";
import DashboardView from "./views/DashboardView";
import DetailView from "./views/DetailView";
import EmployeesView from "./views/EmployeesView";
import FilterEmployees from "./components/FilterEmployees";

import { getEmployees } from "./services/api";

export const formatBackendEmployee = (employee) => {
  const mock = mockEmployees.find((item) => item.name === employee?.name) ?? {};
  const normalizedId =
    employee?.dbId ?? employee?.usr_matricule ?? employee?.id;
  const formatted = {
    ...mock,
    ...employee,
    id: employee?.id?.toString().startsWith("EMP-")
      ? employee.id
      : `${String(normalizedId ?? "").padStart(3, "0")}`,
    dbId: normalizedId,
    department:
      employee?.department ??
      employee?.departement ??
      mock?.department ??
      mock?.departement ??
      "",
    fonction: employee?.fonction ?? employee?.role ?? mock?.fonction ?? "",
    email: employee?.email ?? mock?.email ?? "",
    phone: employee?.phone ?? mock?.phone ?? "",
    diploma: employee?.diploma ?? mock?.diploma ?? "",
    score: employee?.score ?? mock?.score ?? 0,
    productivity: employee?.productivity ?? mock?.productivity ?? 0,
    quality: employee?.quality ?? mock?.quality ?? 0,
  };
  return formatted;
};

const buildEmployees = (backendEmployees) => {
  if (!Array.isArray(backendEmployees) || backendEmployees.length === 0) {
    return mockEmployees;
  }
  return backendEmployees.map(formatBackendEmployee);
};

export default function App() {
  const [view, setView] = useState("dashboard");
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employeeError, setEmployeeError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadEmployees() {
      try {
        const backendEmployees = await getEmployees();
        if (!mounted) return;

        const finalEmployees = buildEmployees(backendEmployees);
        setEmployees(finalEmployees);

        const loggedEmployee = finalEmployees.find(
          (employee) => employee.dbId === 8114,
        );

        setSelectedEmployee(
          loggedEmployee ?? finalEmployees[0] ?? mockEmployees[0],
        );
      } catch (error) {
        if (!mounted) return;
        setEmployeeError(error.message);
        setEmployees(mockEmployees);
        setSelectedEmployee(mockEmployees[0]);
      }
    }
    loadEmployees();
    return () => {
      mounted = false;
    };
  }, []);

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
          employees={employees}
          onNavigate={navigate}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
      {view === "employees" && (
        <EmployeesView
          employees={employees}
          onNavigate={navigate}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
      {view === "detail" && (
        <DetailView
          employee={selectedEmployee}
          employees={employees}
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
