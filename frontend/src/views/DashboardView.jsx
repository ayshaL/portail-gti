import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  Sparkles,
  Target,
  FileText,
  User,
  CalendarDays as CalendarIcon,
} from "lucide-react";
import Avatar from "../components/Avatar";
import MetricCard from "../components/MetricCard";
import RankChart from "../components/RankChart";
import PageHeader from "../components/PageHeader";
import PerformanceChart from "../components/PerformanceChart";
import {
  employees as mockEmployees,
  documents,
  events,
} from "../data/dashboardData";
import { employees_hist } from "../data/mockData";

export default function DashboardView({
  employees,
  onNavigate,
  sidebarCollapsed,
}) {
  const roster =
    Array.isArray(employees) && employees.length > 0
      ? employees
      : mockEmployees;

  const historyByMonth = employees_hist.reduce((acc, employee) => {
    employee.history.forEach((row) => {
      const month = row.month;
      const current = acc.get(month) ?? {
        month,
        attendance: 0,
        lateness: 0,
        count: 0,
      };
      current.attendance += row.presence;
      current.lateness += row.retard;
      current.count += 1;
      acc.set(month, current);
    });
    return acc;
  }, new Map());

  const dashboardHistory = Array.from(historyByMonth.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, attendance, lateness, count }) => ({
      month,
      attendance: Math.round(attendance / count),
      lateness: Math.round(lateness / count),
    }));

  const topScores = [...roster]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 10)
    .map(({ id, name, fonction, score, productivity }) => ({
      id,
      name,
      fonction,
      score,
      productivity,
    }));

  const topProductivity = [...roster]
    .sort((a, b) => (b.productivity ?? 0) - (a.productivity ?? 0))
    .slice(0, 10)
    .map(({ id, name, fonction, score, productivity }) => ({
      id,
      name,
      fonction,
      score,
      productivity,
    }));

  const worstScores = [...roster]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map(({ id, name, fonction, score }) => ({
      id,
      name,
      fonction,
      score,
    }));

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

  return (
    <main style={styles.content(sidebarCollapsed)}>
      <PageHeader />

      <section style={styles.metricGrid}>
        <MetricCard
          icon={CalendarDays}
          label="Taux de présence"
          value="92%"
          note="↑ 3.4% vs. Juin"
          tone="teal"
        />
        <MetricCard
          icon={Clock3}
          label="Cumul des retards"
          value="3.5 h"
          note="↓ 1.5 h vs. Juin"
        />
        <MetricCard
          icon={BriefcaseBusiness}
          label="Solde Congé"
          value="31 jours"
          tone="blue"
        />
        {/* <MetricCard
          icon={Target}
          label="Score Actuel"
          value="91%"
          note="Top 8%"
          tone="violet"
        /> */}
      </section>

      <section style={styles.layout}>
        <article style={styles.panel}>
          <div style={styles.heading}>
            <div>
              <h2 style={styles.h2}>Taux de présence</h2>
              <p style={styles.sub}>Évolution de la présence mensuelle</p>
            </div>
          </div>
          <PerformanceChart
            data={dashboardHistory}
            lines={[
              {
                dataKey: "attendance",
                name: "Présence (%)",
                stroke: "#1f3d7a",
                yAxisId: "left",
              },
            ]}
            height={280}
          />
        </article>

        <article style={styles.panel}>
          <div style={styles.heading}>
            <div>
              <h2 style={styles.h2}>Retards</h2>
              <p style={styles.sub}>Évolution des minutes de retard</p>
            </div>
          </div>
          <PerformanceChart
            data={dashboardHistory}
            lines={[
              {
                dataKey: "lateness",
                name: "Retards (min)",
                stroke: "#e96a4b",
                yAxisId: "left",
              },
            ]}
            referenceLines={[{ y: 15 }]}
            height={280}
          />
        </article>
      </section>

      <section style={styles.rankGrid}>
        <RankChart
          data={topScores}
          dataKey="score"
          title="Meilleurs scores"
          accent="#e96a4b"
        />
        <RankChart
          data={topProductivity}
          dataKey="productivity"
          title="Meilleures Productivités"
          accent="#2d8c89"
        />

        <section style={styles.panel}>
          <div style={styles.heading}>
            <div>
              <h2 style={styles.h2}>Pires scores</h2>
              <p style={styles.sub}>
                Basé sur les données réelles des employés
              </p>
            </div>
          </div>
          <div style={styles.worstList}>
            {worstScores.map((employee) => (
              <div key={employee.id} style={styles.worstRow}>
                <div>
                  <strong style={styles.worstName}>{employee.name}</strong>
                  <div style={styles.worstFunction}>{employee.fonction}</div>
                </div>
                <span style={styles.worstScore}>{employee.score}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section style={styles.sideGrid}>
        <article style={styles.panel}>
          <div style={styles.heading}>
            <div>
              <h2 style={styles.h2}>Collaborateurs</h2>
              <p style={styles.sub}>
                Liste de l’équipe avec contact et identifiant.
              </p>
            </div>
          </div>
          <div style={styles.employeeListScrollable}>
            {roster.map((employee) => (
              <div key={employee.id} style={styles.employeeRow}>
                <div style={styles.employeeInfo}>
                  <div style={styles.employeeTitle}>
                    <span style={styles.employeeId}>{employee.id} |</span>
                    <strong style={styles.employeeName}>{employee.name}</strong>
                  </div>
                  <div style={styles.employeeContact}>
                    <span>{employee.phone}</span>
                    <span>{employee.email}</span>
                  </div>
                </div>
                <Avatar employee={employee} small />
              </div>
            ))}
          </div>
        </article>

        <div style={styles.rightColumn}>
          <article style={styles.panel}>
            <div style={styles.heading}>
              <div>
                <h2 style={styles.h2}>Disponibilité</h2>
                <p style={styles.sub}>
                  Présence sur site, télétravail et congés.
                </p>
              </div>
            </div>
            <div style={styles.availabilityGrid}>
              <div style={styles.summaryCard}>
                <strong style={styles.summaryValue}>
                  {availabilitySummary.onSite}
                </strong>
                <span style={styles.summaryLabel}>Sur site</span>
              </div>
              <div style={styles.summaryCard}>
                <strong style={styles.summaryValue}>
                  {availabilitySummary.remote}
                </strong>
                <span style={styles.summaryLabel}>Télétravail</span>
              </div>
              <div style={styles.summaryCard}>
                <strong style={styles.summaryValue}>
                  {availabilitySummary.leave}
                </strong>
                <span style={styles.summaryLabel}>En congés</span>
              </div>
            </div>
          </article>

          <article style={styles.panel}>
            <div style={styles.heading}>
              <div>
                <h2 style={styles.h2}>Documents utiles</h2>
                <p style={styles.sub}>Politiques et guides partagés.</p>
              </div>
            </div>
            <div style={styles.listScrollable}>
              {documents.map((doc) => (
                <div key={doc.id} style={styles.listItem}>
                  <div>
                    <strong style={styles.listTitle}>{doc.title}</strong>
                    <p style={styles.listMeta}>{doc.date}</p>
                  </div>
                  <span style={styles.documentId}>{doc.id}</span>
                </div>
              ))}
            </div>
          </article>

          <article style={styles.panel}>
            <div style={styles.heading}>
              <div>
                <h2 style={styles.h2}>Événements à venir</h2>
                <p style={styles.sub}>Anniversaires et réunions importantes.</p>
              </div>
            </div>
            <div style={styles.listScrollable}>
              {events.map((event) => (
                <div key={event.id} style={styles.listItem}>
                  <div>
                    <strong style={styles.listTitle}>{event.title}</strong>
                    <p style={styles.listMeta}>{event.date}</p>
                  </div>
                  <span style={styles.documentId}>{event.id}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      {/* <section style={styles.layout}>
        <article style={styles.panel}>
          <div style={styles.heading}>
            <div>
              <h2 style={styles.h2}>Mon évolution</h2>
              <p style={styles.sub}>Productivité et qualité, derniers 6 mois</p>
            </div>
            <span style={styles.scorePill}>
              <ArrowUpRight size={14} /> +7.2%
            </span>
          </div>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <i style={styles.orangeDot} />
              Productivité
            </span>
            <span style={styles.legendItem}>
              <i style={styles.tealDot} />
              Qualité
            </span>
          </div>
          <PerformanceChart data={months} />
        </article>
      </section> */}

      {/* <section style={styles.panel}>
        <div style={styles.heading}>
          <div>
            <h2 style={styles.h2}>Team pulse</h2>
            <p style={styles.sub}>
              How your department is performing this month
            </p>
          </div>
          <button onClick={() => onNavigate("employees")} style={styles.button}>
            View all people <ChevronRight size={15} />
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          {employees.slice(0, 4).map((employee) => (
            <button
              style={styles.teamMember}
              key={employee.id}
              onClick={() => onNavigate("detail", employee)}
            >
              <Avatar employee={employee} />
              <div style={styles.teamMemberCopy}>
                <strong style={styles.teamMemberName}>{employee.name}</strong>
                <span style={styles.teamMemberRole}>{employee.role}</span>
              </div>
              <b>{employee.score}</b>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section> */}
    </main>
  );
}

const styles = {
  content: (sidebarCollapsed) => ({
    minHeight: "100vh",
    marginLeft: sidebarCollapsed ? 110 : 286,
    padding: "46px 46px 56px",
    transition: "margin-left .25s ease",
    width: " 100%",
  }),
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 18,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 18,
  },
  panel: {
    padding: 23,
    border: "1px solid #e9edf3",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 24px rgba(24,42,71,.04)",
  },
  heading: { display: "flex", justifyContent: "space-between", gap: 16 },
  h2: { margin: 0, color: "#1b2a43", fontSize: 15 },
  sub: { margin: "6px 0 0", color: "#8490a2", fontSize: 11 },
  scorePill: {
    padding: "5px 7px",
    borderRadius: 6,
    background: "#e7f5f1",
    color: "#25817d",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    gap: 3,
    alignItems: "center",
  },
  legend: {
    display: "flex",
    gap: 17,
    margin: "21px 0 0",
    color: "#637083",
    fontSize: 11,
  },
  legendItem: { display: "flex", alignItems: "center" },
  orangeDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: "50%",
    background: "#e96a4b",
  },
  tealDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    marginRight: 6,
    borderRadius: "50%",
    background: "#2d8c89",
  },
  button: {
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
  teamMemberCopy: { display: "grid", gap: 3 },
  teamMemberName: { color: "#263752", fontSize: 12 },
  teamMemberRole: { color: "#8994a5", fontSize: 11 },
  rankGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 18,
  },
  sideGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1.1fr",
    gap: 18,
    marginBottom: 18,
    alignItems: "start",
  },
  rightColumn: {
    display: "grid",
    gap: 18,
  },
  employeeList: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  },
  employeeListScrollable: {
    display: "grid",
    gap: 12,
    marginTop: 16,
    maxHeight: 780,
    overflowY: "auto",
    paddingRight: 4,
  },
  employeeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #edf0f4",
    background: "#fbfdff",
  },
  employeeInfo: {
    display: "grid",
    gap: 6,
  },
  employeeTitle: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  employeeName: {
    color: "#1b2a43",
    fontSize: 13,
  },
  employeeId: {
    color: "#8490a2",
    fontSize: 11,
  },
  employeeContact: {
    display: "grid",
    gap: 4,
    color: "#647087",
    fontSize: 11,
  },
  availabilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  },
  summaryCard: {
    padding: "16px",
    borderRadius: 14,
    background: "#f8fbff",
    border: "1px solid #e6edf7",
    textAlign: "center",
  },
  summaryValue: {
    display: "block",
    fontSize: 22,
    color: "#1b2a43",
  },
  summaryLabel: {
    display: "block",
    marginTop: 6,
    color: "#647087",
    fontSize: 11,
  },
  list: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  },
  listScrollable: {
    display: "grid",
    gap: 12,
    marginTop: 16,
    maxHeight: 220,
    overflowY: "auto",
    paddingRight: 4,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid #edf0f4",
    background: "#fff",
  },
  listTitle: {
    color: "#1b2a43",
    fontSize: 13,
  },
  listMeta: {
    margin: "4px 0 0",
    color: "#8490a2",
    fontSize: 11,
  },
  documentId: {
    color: "#5a6b7f",
    fontSize: 11,
    fontWeight: 700,
  },
  teamMember: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto auto",
    gap: 12,
    alignItems: "center",
    border: 0,
    borderTop: "1px solid #edf0f4",
    padding: "12px 3px",
    color: "#607087",
    background: "transparent",
    textAlign: "left",
  },
  worstList: {
    display: "grid",
    gap: 8,
    marginTop: 16,
  },
  worstRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #e9edf3",
    background: "#fff",
  },
  worstName: { color: "#1b2a43", fontSize: 13 },
  worstFunction: { color: "#8490a2", fontSize: 11, marginTop: 4 },
  worstScore: {
    minWidth: 36,
    textAlign: "center",
    color: "#e96a4b",
    fontWeight: 700,
  },
};
