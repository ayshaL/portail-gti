import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";
import Avatar from "../components/Avatar";
import MetricCard from "../components/MetricCard";
import RankChart from "../components/RankChart";
import PageHeader from "../components/PageHeader";
import PerformanceChart from "../components/PerformanceChart";
import { employees, months } from "../data/dashboardData";

export default function DashboardView({ onNavigate, sidebarCollapsed }) {
  return (
    <main style={styles.content(sidebarCollapsed)}>
      <PageHeader eyebrow="Juil 2026" title="Bienvenue, Nadia">
        {/* <button className="period-button">
          This month <ChevronRight size={15} />
        </button> */}
      </PageHeader>
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
        <MetricCard
          icon={Target}
          label="Score Actuel"
          value="91%"
          note="Top 8%"
          tone="violet"
        />
      </section>

      <section style={styles.rankGrid}>
        <RankChart
          dataKey="score"
          title="Meilleurs scores"
          accent="#e96a4b"
        />
        <RankChart
          dataKey="productivity"
          title="Meilleures Productivités"
          accent="#2d8c89"
        />
      </section>
      <section style={styles.layout}>
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
      </section>
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
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 18,
  },
  layout: {
    display: "grid",
    // gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, .8fr)",
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
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 18,
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
};
