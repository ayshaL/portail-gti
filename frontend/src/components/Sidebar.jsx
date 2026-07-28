import {
  House,
  Users,
  FolderGit2,
  ChevronRight,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import Avatar from "./Avatar";
import { employees } from "../data/dashboardData";

function Sidebar({ view, onNavigate, collapsed, onToggle }) {

  // const employees = api.getEmployees();

  return (
    <aside style={styles.sidebar(collapsed)}>
      <div style={styles.inner}>
        <div>
          <button
            style={styles.toggle}
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span style={styles.toggleIcon}>
              {collapsed ? (
                <CircleChevronRight color="#1C3F76" size={20} />
              ) : (
                <CircleChevronLeft size={20} />
              )}
            </span>
          </button>

          <button
            style={styles.brand(collapsed)}
            onClick={() => onNavigate("dashboard")}
          >
            <img
              src="https://gtiinfo.com.tn/wp-content/uploads/2023/08/logo2-2-120x85.png"
              alt="Company Logo"
              style={styles.logo(collapsed)}
            />
          </button>
          {!collapsed && <p style={styles.label}>WORKSPACE</p>}

          <nav style={styles.nav}>
            <button
              style={styles.navItem(view === "dashboard", collapsed)}
              onClick={() => onNavigate("dashboard")}
            >
              <House size={18} />
              {!collapsed && <span>Dashboard</span>}
            </button>

            <button
              style={styles.navItem(view === "employees", collapsed)}
              onClick={() => onNavigate("employees")}
            >
              <Users size={18} />
              {!collapsed && <span>Gestion des Utilisateurs</span>}
            </button>

            <button style={styles.navItem(false, collapsed)}>
              <FolderGit2 size={18} />
              {!collapsed && <span>Gestion des Projets</span>}
            </button>
          </nav>
        </div>

        <div>
          <nav style={styles.nav}>
            <div style={styles.user(collapsed)}>
              <Avatar employee={employees[0]} small />
              {!collapsed && (
                <div style={styles.userCopy}>
                  <strong>{employees[0].name}</strong>
                  <span>{employees[0].fonction}</span>
                </div>
              )}
              {!collapsed && <ChevronRight size={16} />}
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

const styles = {
  sidebar: (collapsed) => ({
    position: "fixed",
    inset: "16px auto 16px 16px",
    zIndex: 10,
    width: collapsed ? 78 : 254,
    padding: "24px 14px 16px",
    borderRadius: 20,
    color: "#dce9ff",
    background: "linear-gradient(165deg, #173868, #10284f)",
    boxShadow: "0 18px 50px rgba(19,46,86,.2)",
    transition: "width .25s",
  }),
  inner: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  toggle: {
    position: "absolute",
    top: 23,
    right: -13,
    border: 0,
    padding: 0,
    borderRadius: "50%",
    background: "transparent",
  },
  toggleIcon: {
    width: 27,
    height: 27,
    display: "grid",
    placeItems: "center",
    color: "#1c3f76",
    background: "white",
    borderRadius: "50%",
    boxShadow: "0 3px 10px rgba(3,19,45,.25)",
  },
  brand: (collapsed) => ({
    width: "100%",
    minHeight: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    border: 0,
    padding: "0 10px 15px",
    background: "transparent",
    borderBottom: "1px solid rgba(222,236,255,.15)",
  }),
  logo: (collapsed) => ({
    width: collapsed ? 38 : 200,
    height: 50,
    objectFit: "contain",
    objectPosition: "center",
  }),
  label: {
    margin: "25px 11px 10px",
    color: "#8ea8cc",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".11em",
  },
  nav: { display: "grid", gap: 5 },
  navItem: (active, collapsed) => ({
    width: "100%",
    minHeight: 45,
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: 12,
    border: 0,
    borderRadius: 10,
    padding: collapsed ? 0 : "0 12px",
    color: active ? "white" : "#b9cae3",
    background: active ? "#e96a4b" : "transparent",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 600,
  }),
  user: (collapsed) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "flex-start",
    gap: 9,
    padding: "11px 8px",
    borderRadius: 11,
    background: "rgba(255,255,255,.08)",
  }),
  userCopy: {
    minWidth: 0,
    flex: 1,
    display: "grid",
    gap: 2,
    fontSize: 11,
    color: "#dce9ff",
  },
};
