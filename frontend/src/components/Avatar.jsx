function Avatar({ employee, small = false }) {
  const size = small ? 31 : 41;
  return (
    <span
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: employee.color,
        color: "#ffffff",
        border: "2px solid rgba(255,255,255,.8)",
        borderRadius: "50%",
        boxShadow: "0 3px 10px rgba(24,42,71,.12)",
        fontSize: small ? 10 : 12,
        fontWeight: 700,
      }}
    >
      {employee.initials}
    </span>
  );
}

export default Avatar;
