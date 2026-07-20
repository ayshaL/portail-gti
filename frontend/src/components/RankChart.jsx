import { Award } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartTooltip, rankings } from "../data/dashboardData";

const styles = {
  panel: {
    padding: 23,
    border: "1px solid #e9edf3",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 24px rgba(24,42,71,.04)",
  },
  heading: { display: "flex", justifyContent: "space-between" },
  title: { margin: 0, color: "#1b2a43", fontSize: 15 },
  subtitle: { margin: "6px 0 0", color: "#8490a2", fontSize: 11 },
};

export default function RankChart({ dataKey, title, accent }) {
  return (
    <article style={styles.panel}>
      <div style={styles.heading}>
        <div>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.subtitle}>Top 10 · Juin 2026</p>
        </div>
        <Award size={20} color={accent} />
      </div>
      <ResponsiveContainer width="100%" height={285}>
        <BarChart
          data={rankings}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 4, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={88}
            tick={{ fill: "#637083", fontSize: 11 }}
          />
          <Tooltip cursor={{ fill: "#f7f8fa" }} contentStyle={chartTooltip} />
          <Bar dataKey={dataKey} radius={[0, 5, 5, 0]} barSize={14}>
            {rankings.map((item, index) => (
              <Cell key={item.name} fill={index < 3 ? accent : `${accent}88`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}
