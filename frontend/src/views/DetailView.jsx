import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  CircleAlert,
  Download,
  FileText,
  Mail,
  Phone,
  ChevronRight,
  Sparkles,
  Bold,
} from "lucide-react";
import Avatar from "../components/Avatar";
import PerformanceChart from "../components/PerformanceChart";
import { employees as mockEmployees } from "../data/dashboardData";
import { employees_hist } from "../data/mockData";
import { getEmployeePrediction } from "../services/api";

export default function DetailView({
  employee,
  employees,
  onNavigate,
  sidebarCollapsed,
}) {
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const roster =
    Array.isArray(employees) && employees.length > 0
      ? employees
      : mockEmployees;
  const subject = employee || roster[0];
  const details = subject?.skills
    ? subject
    : { ...(roster[0] ?? {}), ...(subject ?? {}) };
  const userHistory =
    employees_hist.find((item) => item.id === subject?.id)?.history ?? [];

  useEffect(() => {
    let isMounted = true;
    async function loadPrediction() {
      setLoadingPrediction(true);
      setPredictionError(null);
      try {
        const employeeId = details.dbId ?? details.id;
        const result = await getEmployeePrediction(employeeId);
        if (isMounted) {
          setPrediction(result);
        }
      } catch (error) {
        if (isMounted) {
          setPredictionError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoadingPrediction(false);
        }
      }
    }

    loadPrediction();
    return () => {
      isMounted = false;
    };
  }, [details.id, details.dbId]);

  const trendProdData = userHistory.map((row) => ({
    month: row.month,
    productivity: row.productivite,
    quality: row.qualite,
  }));

  const trendScoreData = userHistory.map((row) => ({
    month: row.month,
    score: row.score,
  }));

  return (
    <main style={styles.content(sidebarCollapsed)}>
      <div>
        <button
          style={styles.backButton}
          onClick={() => onNavigate("employees")}
        >
          <ChevronLeft size={17} />
          Retour
        </button>
        <section style={styles.profileHeader}>
          <Avatar employee={details} />
          <div>
            <p style={styles.eyebrow}>
              {details.id} · {details.departement}
            </p>
            <h1 style={styles.profileTitle}>{details.name}</h1>
            <p style={styles.profileRole}>{details.fonction}</p>
          </div>
        </section>
      </div>

      <section style={styles.detailGrid}>
        <article style={styles.panel}>
          <h2 style={styles.panelTitle}>Profile & contact</h2>
          <div style={styles.detailLines}>
            <p style={styles.detailLine}>
              <Mail size={16} />
              <span>Email</span>
              <strong>{details.email}</strong>
            </p>
            <p style={styles.detailLine}>
              <Phone size={16} />
              <span>Téléphone</span>
              <strong>{details.phone}</strong>
            </p>
            <p style={styles.detailLine}>
              <CalendarDays size={16} />
              <span>Date de naissance</span>
              <strong>{details.birthdate}</strong>
            </p>
            <p style={styles.detailLine}>
              <BriefcaseBusiness size={16} />
              <span>Departement</span>
              <strong>{details.departement}</strong>
            </p>
          </div>
          <div style={styles.resumeRow}>
            <span style={styles.documentIcon}>
              <FileText size={17} />
            </span>
            <div>
              <strong style={{ fontSize: 12 }}>
                Resume {employee.name}.pdf
              </strong>
            </div>
            <Download size={17} />
          </div>
        </article>

        {/* <article style={styles.panel}>
          <h2 style={styles.panelTitle}>Professional career</h2>
          <div style={styles.timeline}>
            {Object.entries(details.parcours.gti).map((item, index) => (
              <div key={item.title} style={styles.timelineItem}>
                <i
                  style={
                    index === 0 ? styles.timelineDotCurrent : styles.timelineDot
                  }
                />
                <div>
                  <strong style={styles.timelineTitle}>{item.title}</strong>
                  <span style={styles.timelineDate}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
          <h3 style={styles.skillsTitle}>Core competences</h3>
          <div style={styles.skills}>
            {details.skills.map((skill) => (
              <span key={skill} style={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </article> */}

        <article style={styles.panel}>
          <h2 style={styles.panelTitle}>Parcours Professionel</h2>

          <div style={styles.timelineTrack}>
            <i style={styles.timelineLine} />

            {details?.parcours?.gti && (
              <div style={styles.timelineItem}>
                <i style={styles.timelineDotCurrent} />
                <div>
                  <strong style={styles.timelineTitle}>
                    {details.parcours.gti.projetAffecte} (
                    {details.parcours.gti.situation})
                  </strong>
                  <span style={styles.timelineDate}>
                    {details.parcours.gti.datePriseDu} —{" "}
                    {details.parcours.gti.datePriseAu || "Présent"}
                  </span>
                </div>
              </div>
            )}

            {details?.parcours?.academique && (
              <div style={styles.timelineItem}>
                <i style={styles.timelineDot} />
                <div>
                  <strong style={styles.timelineTitle}>
                    {details.parcours.academique.diplome} (
                    {details.parcours.academique.ecole})
                  </strong>
                  <span style={styles.timelineDate}>
                    {details.parcours.academique.enAlternance
                      ? "En alternance"
                      : "Formation initiale"}
                  </span>
                </div>
              </div>
            )}
          </div>
          <h3 style={styles.skillsTitle}>Compétences</h3>
          <div style={styles.skills}>
            {(details?.competences || details?.skills || []).map((skill) => (
              <span key={skill} style={styles.skill}>
                {skill}
              </span>
            ))}
          </div>
        </article>

        {/* ----------------------------- Perspectives IA ------------------------------- */}

        <article style={styles.insight}>
          <div style={styles.heading}>
            <div style={styles.insightIcon}>
              <Sparkles size={20} />
            </div>
            <span style={styles.insightLabel}>PERSPECTIVES IA</span>
          </div>
          <h2 style={styles.insightTitle}>
            {loadingPrediction
              ? "Chargement..."
              : predictionError
                ? "Impossible de prédire"
                : prediction?.alert
                  ? "Attention"
                  : "Estimation"}
          </h2>
          <p style={styles.insightText}>
            {loadingPrediction &&
              "Chargement de la prédiction du score pour le mois suivant..."}
            {predictionError && predictionError}
            {prediction && !loadingPrediction && !predictionError && (
              <>
                Votre score prédit est{" "}
                <strong>{prediction.predicted_score}</strong> pour le mois
                suivant. "{prediction.reasons[0]}"
              </>
            )}
          </p>
          <div style={styles.confidence}>
            <span>Source du modèle</span>
            <strong>{prediction ? "Backend ML" : "N/A"}</strong>
            <div style={styles.confidenceBar}>
              <i style={styles.confidenceProgress} />
            </div>
          </div>
          <button
            // onClick={() => onNavigate("employees")}
            style={styles.exploreButton}
          >
            Explorer les classements
            <ChevronRight size={16} />
          </button>
        </article>
      </section>

      {/* ----------------------------- Courbe prod & qual ------------------------------- */}

      <section style={styles.performanceDetail}>
        <article style={styles.panel}>
          <div style={styles.panelHeading}>
            <div>
              <h2 style={styles.panelTitle}>Performance sur 6 mois</h2>
              <p style={styles.panelSubtitle}>
                Tendence productivité & qualité
              </p>
            </div>
            <span style={styles.scorePill}>
              <ArrowUpRight size={14} /> Progès
            </span>
          </div>
          {/* <PerformanceChart data={trendProdData} height={235} /> */}
          <PerformanceChart
            data={trendProdData}
            lines={[
              {
                dataKey: "productivity",
                name: "Productivité",
                stroke: "#e96a4b",
                yAxisId: "left",
              },
              {
                dataKey: "quality",
                name: "Qualité",
                stroke: "#2d8c89",
                yAxisId: "left",
              },
            ]}
            height={235}
          />
        </article>

        {/* <article style={styles.scoreSummary}>
          <p style={styles.aiLabel}>MODEL ASSESSMENT</p>
          <h2 style={styles.summaryTitle}>{details.status}</h2>
          <p style={styles.assessmentText}>
            {details.statut === "Progressing"
              ? "Consistent gains across both model indicators indicate a strong growth trajectory."
              : "Performance is being monitored using the most recent available model signals."}
          </p>
          <div style={styles.bestWorst}>
            <div style={styles.bestWorstItem}>
              <span style={styles.bestWorstLabel}>Best score</span>
              <strong style={styles.bestWorstValue}>
                94 <small>Jul</small>
              </strong>
            </div>
            <div style={styles.bestWorstItem}>
              <span style={styles.bestWorstLabel}>Lowest score</span>
              <strong style={styles.bestWorstValue}>
                78 <small>Feb</small>
              </strong>
            </div>
          </div>
          <div style={styles.riskNote}>
            <CircleAlert size={17} />
            No current intervention required
          </div>
        </article> */}

        {/* ----------------------------- Courbe GPI score ------------------------------- */}

        <article style={styles.panel}>
          <div style={styles.panelHeading}>
            <div>
              <h2 style={styles.panelTitle}>Mon score sur 6 mois</h2>
            </div>
            <span style={styles.scorePill}>
              <ArrowUpRight size={14} /> Progès
            </span>
          </div>
          <PerformanceChart
            data={trendScoreData}
            lines={[
              {
                dataKey: "score",
                name: "Score",
                stroke: "#4b8de9",
                yAxisId: "left",
              },
            ]}
            height={235}
          />
        </article>
      </section>
    </main>
  );
}

const styles = {
  content: (sidebarCollapsed) => ({
    minHeight: "100vh",
    marginLeft: sidebarCollapsed ? 110 : 286,
    padding: "46px 46px 56px",
    transition: "margin-left .25s ease",
  }),
  backButton: {
    marginBottom: 26,
    background: "transparent",
    border: 0,
    padding: 0,
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 26,
  },
  eyebrow: {
    margin: 0,
    color: "#718099",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".13em",
  },
  profileTitle: {
    margin: 0,
    color: "#142543",
    fontSize: 32,
    letterSpacing: "-.04em",
  },
  profileRole: { margin: "5px 0 0", color: "#778496", fontSize: 13 },
  profileActions: { marginLeft: "auto", display: "flex", gap: 9 },
  outlineButton: {
    border: "1px solid #dce2eb",
    background: "#fff",
    color: "#475569",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    gap: 7,
    alignItems: "center",
  },
  primaryButton: {
    border: "1px solid #e96a4b",
    background: "#e96a4b",
    color: "#fff",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    gap: 7,
    alignItems: "center",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    // gridTemplateColumns: "minmax(0, 1.75fr) minmax(280px, 0.8fr)",
    gap: 16,
    marginBottom: 16,
  },
  panel: {
    padding: 21,
    background: "#fff",
    border: "1px solid #e9edf3",
    borderRadius: 13,
  },
  panelTitle: {
    margin: "0 0 19px",
    color: "#1b2a43",
    fontSize: 15,
    fontWeight: 700,
  },
  detailLines: { display: "grid", gap: 14 },
  detailLine: {
    display: "grid",
    gridTemplateColumns: "22px 90px 1fr",
    alignItems: "center",
    margin: 0,
    fontSize: 12,
  },
  resumeRow: {
    borderTop: "1px solid #dce2eb",
    marginTop: 20,
    paddingTop: 17,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#8794a5",
  },
  documentIcon: {
    width: 34,
    height: 34,
    display: "grid",
    placeItems: "center",
    background: "#fce9e3",
    color: "#d95c40",
    borderRadius: 7,
  },
  timeline: { margin: "3px 0 24px" },
  timelineItem: {
    display: "flex",
    gap: 12,
    minHeight: 50,
    position: "relative",
  },
  timelineTrack: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginLeft: "10px",
  },
  timelineLine: {
    position: "absolute",
    top: "8px",
    bottom: "8px",
    left: "6.5px",
    width: "2px",
    backgroundColor: "#cbd5e1",
    zIndex: 0,
  },
  timelineDot: {
    width: 11,
    height: 11,
    border: "2px solid #a8b5c3",
    borderRadius: "50%",
    background: "white",
    zIndex: 1,
  },
  timelineDotCurrent: {
    width: 11,
    height: 11,
    border: "2px solid #e8451d",
    borderRadius: "50%",
    background: "#e8451d",
    zIndex: 1,
  },
  timelineTitle: { display: "block", color: "#3e4d60", fontSize: 12 },
  timelineDate: {
    display: "block",
    marginTop: 2,
    color: "#8c98a7",
    fontSize: 12,
  },
  skillsTitle: {
    margin: "0 0 10px",
    color: "#435165",
    font: "600 12px Manrope, sans-serif",
  },
  skills: { display: "flex", flexWrap: "wrap", gap: 7 },
  skill: {
    color: "#4d6476",
    background: "#edf5f5",
    padding: "5px 8px",
    borderRadius: 5,
    fontSize: 10,
    fontWeight: 600,
  },
  heading: { display: "flex", justifyContent: "space-between", gap: 16 },
  insight: {
    padding: 23,
    borderRadius: 16,
    color: "#e8f1ff",
    background: "linear-gradient(145deg,#1e477d,#152f5d)",
  },
  insightIcon: {
    width: 39,
    height: 39,
    display: "grid",
    placeItems: "center",
    borderRadius: 11,
    color: "#ffbe66",
    background: "rgba(255,255,255,.12)",
  },
  insightLabel: {
    color: "#a7c1e5",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".13em",
  },
  insightTitle: { margin: "23px 0 10px", color: "#fff", fontSize: 19 },
  insightText: { margin: 0, color: "#ccdaef", fontSize: 12, lineHeight: 1.65 },
  confidence: {
    margin: "24px 0 18px",
    color: "#bad0ed",
    fontSize: 11,
  },
  confidenceBar: {
    height: 6,
    marginTop: 7,
    overflow: "hidden",
    borderRadius: 6,
    background: "rgba(255,255,255,.16)",
  },
  confidenceProgress: {
    display: "block",
    width: "87%",
    height: "100%",
    background: "#75d2c7",
  },
  exploreButton: {
    border: 0,
    padding: 0,
    color: "#fff",
    background: "transparent",
    fontSize: 12,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  performanceDetail: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    // gridTemplateColumns: "minmax(0, 1.75fr) minmax(260px, 0.8fr)",
    gap: 16,
  },
  panelHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  panelSubtitle: { margin: "6px 0 0", color: "#8490a2", fontSize: 11 },
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
  scoreSummary: {
    padding: 21,
    background: "#fff",
    border: "1px solid #e9edf3",
    borderRadius: 13,
    display: "flex",
    flexDirection: "column",
  },
  aiLabel: {
    margin: 0,
    color: "#718099",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".13em",
  },
  summaryTitle: { fontSize: 21, margin: "15px 0 0", color: "#1b2a43" },
  assessmentText: {
    margin: 0,
    color: "#758294",
    fontSize: 12,
    lineHeight: 1.6,
  },
  bestWorst: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    marginTop: "auto",
    borderTop: "1px solid #dce2eb",
    paddingTop: 16,
    gap: 12,
  },
  bestWorstItem: {},
  bestWorstLabel: { display: "block", color: "#8c98a6", fontSize: 10 },
  bestWorstValue: {
    display: "block",
    color: "#314155",
    font: "700 19px Manrope, sans-serif",
    marginTop: 2,
  },
  riskNote: {
    marginTop: 17,
    color: "#40827f",
    background: "#edf8f6",
    borderRadius: 6,
    padding: 8,
    fontSize: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};
