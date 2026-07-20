export default function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  tone = "orange",
}) {
  const palette = {
    orange: ["#e96a4b", "#fff0eb"],
    teal: ["#2d8c89", "#e8f6f4"],
    blue: ["#4d79be", "#edf3fc"],
    violet: ["#7654b8", "#f2edfc"],
  }[tone];
  const styles = {
    card: {
      minHeight: 132,
      display: "flex",
      flexDirection: "column",
      gap: 13,
      padding: "21px 18px",
      border: "1px solid #e9edf3",
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 8px 24px rgba(24,42,71,.04)",
    },
    icon: {
      width: 39,
      height: 39,
      display: "grid",
      placeItems: "center",
      flex: "0 0 39px",
      borderRadius: 11,
      color: palette[0],
      background: palette[1],
    },
    label: { margin: "1px 0 5px", color: "#758197", fontSize: 12 },
    value: { display: "block", color: "#17233a", fontSize: 22 },
    note: { display: "block", marginTop: 7, color: "#79869a", fontSize: 11 },
  };
  return (
    <article style={styles.card}>
      <div style={styles.icon}>
        <Icon size={19} />
      </div>
      <div>
        <p style={styles.label}>{label}</p>
        <strong style={styles.value}>{value}</strong>
        <span style={styles.note}>{note}</span>
      </div>
    </article>
  );
}
