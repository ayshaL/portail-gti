function PageHeader({ eyebrow, title, children }) {
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
  return (
    <header style={styles.header}>
      <div>
        <p style={styles.eyebrow}>{eyebrow}</p>
        <h1 style={styles.title}>{title}</h1>
      </div>
      {children}
    </header>
  );
}

export default PageHeader;
