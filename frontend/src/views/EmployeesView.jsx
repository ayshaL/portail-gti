import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Search,
  Eye,
  FileText,
  PencilLine,
  Trash2,
  BriefcaseBusiness,
  PersonStanding,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react";
import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import { employees } from "../data/dashboardData";
import FilterEmployees, {
  emptyFilters,
  filterEmployees,
} from "../components/FilterEmployees";

export default function EmployeesView({ onNavigate, sidebarCollapsed }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  const shown = useMemo(
    () => filterEmployees(employees, filters, query),
    [query, filters],
  );
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "niveaux") return value.length > 0;
    if (key === "senioriteMode") return false;
    return value && value !== "All" && value !== "";
  }).length;

  return (
    <main style={styles.content(sidebarCollapsed)}>
      <PageHeader title="Gestion Utilisateurs" />
      <section style={styles.metricGrid}>
        <MetricCard
          icon={BriefcaseBusiness}
          label="Effectif total"
          value="170"
          tone="teal"
        />
        <MetricCard icon={RefreshCcw} label="Taux de turnover" value="5%" />
        <MetricCard
          icon={RefreshCcw}
          label="Taux de rétention"
          value="5%"
          tone="blue"
        />
        <MetricCard
          icon={FileText}
          label="Types de contracts"
          value="90"
          note="CIVP"
          tone="violet"
        />
      </section>

      <section style={styles.panel}>
        <div style={styles.tableToolbar}>
          <label style={styles.search}>
            <Search size={17} />
            <input
              style={styles.searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Recherhe par nom, role ou ID"
            />
          </label>

          <button
            style={styles.filterButton}
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={15} />
            Filtre
            {activeFilterCount > 0 && (
              <span style={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nom Utilisateur</th>
                <th style={styles.th}>Utilisateur ID</th>
                <th style={styles.th}>Fonction</th>
                <th style={styles.th}>Diplome</th>
                <th style={styles.th}>Dernier score</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((employee) => (
                <tr
                  key={employee.id}
                  // onClick={() => onNavigate("detail", employee)}
                  style={styles.row}
                >
                  <td style={styles.td}>
                    <div style={styles.personCell}>
                      <Avatar employee={employee} small />
                      <div style={styles.personCopy}>
                        <strong style={styles.personName}>
                          {employee.name}
                        </strong>
                        <span style={styles.personDepartment}>
                          {employee.department}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={styles.mono}>{employee.id}</td>
                  <td style={styles.td}>{employee.fonction}</td>
                  <td style={styles.td}>{employee.diploma}</td>
                  <td style={styles.td}>
                    <span style={styles.scoreBadge}>{employee.score}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.contactCell}>
                      <span style={styles.contactPrimary}>
                        {employee.email}
                      </span>
                      <span style={styles.contactSecondary}>
                        {employee.phone}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <Eye color="#0042aa" size={13} /> */}
                    <FileText
                      color="#000000"
                      size={13}
                      onClick={() => onNavigate("detail", employee)}
                    />
                    <PencilLine color="#2a8b22" size={13} />
                    <Trash2 color="#d22929" size={13} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FilterEmployees
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        initialFilters={filters}
        onApply={setFilters}
        employees={employees}
      />
    </main>
  );
}

const styles = {
  content: (sidebarCollapsed) => ({
    minHeight: "100vh",
    marginLeft: sidebarCollapsed ? 110 : 286,
    width: "100%",
    padding: "46px 46px 56px",
    transition: "margin-left .25s ease",
  }),
  periodButton: {
    border: "1px solid #dce2eb",
    borderRadius: 9,
    padding: "9px 13px",
    color: "#42516a",
    background: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  panel: {
    padding: 0,
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #e9edf3",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(24,42,71,.04)",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 18,
  },
  tableToolbar: {
    padding: "21px 21px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  title: { margin: 0, color: "#1b2a43", fontSize: 15 },
  subtitle: { margin: "6px 0 0", color: "#8490a2", fontSize: 11 },
  search: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #dce2eb",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#8390a0",
  },
  searchInput: {
    border: 0,
    outline: 0,
    width: 155,
    fontSize: 12,
    color: "#1c3f76",
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid #dce2eb",
    borderRadius: 8,
    padding: "9px 14px",
    background: "#fff",
    color: "#42516a",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    position: "relative",
  },
  filterBadge: {
    background: "#e96a4b",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 999,
    padding: "1px 6px",
  },
  tableWrap: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 880,
  },
  th: {
    background: "#f8f9fa",
    color: "#8793a3",
    textAlign: "left",
    font: '500 10px "DM Mono", monospace',
    letterSpacing: 0.5,
    padding: "11px 20px",
    textTransform: "uppercase",
  },
  td: {
    padding: "13px 20px",
    borderTop: "1px solid #edf0f2",
    color: "#566476",
    fontSize: 12,
  },
  row: {
    cursor: "pointer",
    transition: "background 0.15s",
  },
  personCell: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    maxWidth: 180,
  },
  personCopy: { minWidth: 0 },
  personName: {
    color: "#1c3f76",
    fontSize: 12,
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  personDepartment: {
    display: "block",
    color: "#8490a0",
    fontSize: 10,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mono: {
    font: '11px "DM Mono", monospace',
    color: "#748196",
  },
  scoreBadge: {
    background: "#fceae5",
    color: "#cf573c",
    padding: "4px 7px",
    borderRadius: 5,
    fontWeight: 700,
  },
  contactCell: { display: "grid", gap: 2 },
  contactPrimary: { display: "block", fontSize: 11, lineHeight: 1.55 },
  contactSecondary: {
    display: "block",
    fontSize: 11,
    lineHeight: 1.55,
    color: "#8d98a7",
  },
};
