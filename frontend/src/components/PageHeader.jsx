import { employees } from "../data/dashboardData";

function PageHeader() {
  return (
    <header style={styles.header}>
      <div>
        <p style={styles.eyebrow}></p>
        <h1 style={styles.title}>Bienvenue, {employees[0].name}</h1>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 30,
  },
  eyebrow: {
    margin: "0 0 7px",
    color: "#718099",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".13em",
  },
  title: {
    margin: 0,
    color: "#142543",
    fontSize: 32,
    letterSpacing: "-.04em",
  },
};

export default PageHeader;
