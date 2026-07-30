import { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  Search,
  Eye,
  FileText,
  PencilLine,
  CircleX,
  BriefcaseBusiness,
  PersonStanding,
  RefreshCcw,
  UserRoundPlus,
  SlidersHorizontal,
} from "lucide-react";
import Avatar from "../components/Avatar";
import PageHeader from "../components/PageHeader";
import MetricCard from "../components/MetricCard";
import { employees as mockEmployees } from "../data/dashboardData";
import FilterEmployees, {
  emptyFilters,
  filterEmployees,
} from "../components/FilterEmployees";
import AddEmployee from "../components/AddEmployee";

// get pagination in list 1-2-...-8
function getPageList(current, total) {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const keep = new Set([1, current, current + 1, total]);
  const pages = [...keep]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const withEllipsis = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(n);
  });
  return withEllipsis;
}

export default function EmployeesView({
  employees,
  onNavigate,
  sidebarCollapsed,
}) {
  const [query, setQuery] = useState("");
  // filter
  const [filters, setFilters] = useState(emptyFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  // add collaborateur
  const [addOpen, setAddOpen] = useState(false);
  const [addedEmployees, setAddedEmployees] = useState([]);

  // pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const roster = [
    ...addedEmployees,
    ...(Array.isArray(employees) && employees.length > 0
      ? employees
      : mockEmployees),
  ];

  const availabilitySummary = roster.reduce(
    (acc, employee) => {
      if (employee.onLeave) {
        acc.leave += 1;
      } else if (employee.workMode === "Remote") {
        acc.remote += 1;
      } else {
        acc.onSite += 1;
      }
      return acc;
    },
    { onSite: 0, remote: 0, leave: 0 },
  );

  const shown = useMemo(
    () => filterEmployees(roster, filters, query),
    [query, filters],
  );

  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  const paginated = useMemo(
    () => shown.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [shown, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [query, filters]);
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "niveaux") return value.length > 0;
    if (key === "senioriteMode") return false;
    return value && value !== "All" && value !== "";
  }).length;

  return (
    <main style={styles.content(sidebarCollapsed)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 30,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#142543",
            fontSize: 32,
            letterSpacing: "-.04em",
          }}
        >
          Gestion Utilisateurs
        </h1>
      </div>
      <section style={styles.metricGrid}>
        <MetricCard
          icon={BriefcaseBusiness}
          label="Effectif total"
          value={
            availabilitySummary.onSite +
            availabilitySummary.remote +
            availabilitySummary.leave
          }
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
          value="70"
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

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={styles.filterButton}
              onClick={() => setAddOpen(true)}
            >
              <UserRoundPlus size={15} color="#cf573c" />
              Ajouter un Collaborateur
            </button>

            <button
              style={{
                ...styles.filterButton,
                background: "#e96a4b",
                color: "#fff",
              }}
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={15} />
              Filtre
              {activeFilterCount > 0 && (
                <span style={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Utilisateur ID</th>
                <th style={styles.th}>Nom Utilisateur</th>
                <th style={styles.th}>Fonction</th>
                <th style={styles.th}>Diplome</th>
                <th style={styles.th}>Dernier score</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((employee) => (
                <tr key={employee.id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={styles.personCell}>
                      <Avatar employee={employee} small />
                      <div style={styles.personCopy}>
                        <strong style={styles.mono}>{employee.id}</strong>
                        {/* <span style={styles.personDepartment}>
                          {employee.department}
                        </span> */}
                      </div>
                    </div>
                  </td>
                  <td style={styles.personName}>{employee.name}</td>
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
                    <CircleX color="#d22929" size={13} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.paginationBar}>
          <span style={styles.paginationInfo}>
            {shown.lenght === 0
              ? "Aucun résultat"
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  shown.length,
                )} sur ${shown.length}`}
          </span>
          <div style={styles.paginationControls}>
            <button
              type="button"
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </button>

            {getPageList(currentPage, pageCount).map((item, index) =>
              item === "..." ? (
                <span key={`ellipsis-${index}`} style={styles.pageEllipsis}>
                  …
                </span>
              ) : (
                <button
                  type="button"
                  key={item}
                  style={{
                    ...styles.pageButton,
                    ...(item === currentPage ? styles.pageButtonActive : {}),
                  }}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              style={{
                ...styles.pageButton,
                ...(currentPage === pageCount ? styles.pageButtonDisabled : {}),
              }}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <FilterEmployees
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        initialFilters={filters}
        onApply={setFilters}
        employees={roster}
      />

      <AddEmployee
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(newEmployee) =>
          setAddedEmployees((prev) => [newEmployee, ...prev])
        }
        employees={roster}
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
  tableWrap: {
    display: "grid",
    gap: 12,
    marginTop: 16,
    maxHeight: 620,
    overflowY: "auto",
    paddingRight: 4,
    overflowX: "auto",
  },
  paginationBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 21px",
    borderTop: "1px solid #edf0f2",
  },
  paginationInfo: {
    color: "#8490a2",
    fontSize: 11,
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  pageIndicator: {
    color: "#42516a",
    fontSize: 12,
    fontWeight: 600,
    minWidth: 78,
    textAlign: "center",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "1px solid #dce2eb",
    borderRadius: 7,
    background: "#fff",
    color: "#42516a",
    cursor: "pointer",
  },
  pageButtonDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  pageButtonActive: {
    background: "#e96a4b",
    borderColor: "#e96a4b",
    color: "#fff",
  },
  pageEllipsis: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 34,
    height: 34,
    color: "#8490a2",
    fontSize: 13,
    fontWeight: 700,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 880,
  },
  th: {
    position: "sticky",
    top: 0,
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
    padding: "13px 20px",
    borderTop: "1px solid #edf0f2",
    color: "#1c3f76",
    fontSize: 12,
    fontWeight: 600,
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
