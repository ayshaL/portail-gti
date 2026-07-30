import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const LOGO_URL =
  "https://gtiinfo.com.tn/wp-content/uploads/2023/08/logo2-2-120x85.png";

// ── Small building blocks ────────────────────────────────────────────────
function TextField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function CheckLine({ checked, onClick, children }) {
  return (
    <div style={styles.checkRow} onClick={onClick}>
      <span
        style={{
          ...styles.checkBox,
          ...(checked ? styles.checkBoxActive : {}),
        }}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </span>
      <span style={styles.checkLabel}>{children}</span>
    </div>
  );
}

// Signature graphic: concentric "orbit" rings with satellite dots and a
// rising bar-cluster — a nod to the portal's actual subject (tracking team
// productivity/performance over time), rendered in the brand palette.
function OrbitMark() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 360 360"
      style={{ position: "absolute", inset: 0 }}
    >
      <circle
        cx="180"
        cy="170"
        r="128"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
      <circle
        cx="180"
        cy="170"
        r="88"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <circle cx="180" cy="42" r="7" fill="#6fcdcb" opacity="0.8"/>
      <circle cx="292" cy="170" r="5" fill="#dbbf9d" opacity="0.8"/>
      <circle cx="180" cy="258" r="6" fill="#e8451d" opacity="0.8"/>
      <circle cx="94" cy="120" r="4" fill="#baddea" opacity="0.8"/>
      <g transform="translate(120, 210)">
        <rect
          x="0"
          y="52"
          width="20"
          height="34"
          rx="4"
          fill="#6fcdcb"
          opacity="0.8"
        />
        <rect
          x="28"
          y="30"
          width="20"
          height="56"
          rx="4"
          fill="#dbbf9d"
          opacity="0.8"
        />
        <rect
          x="56"
          y="8"
          width="20"
          height="78"
          rx="4"
          fill="#e8451d"
          opacity="0.8"
        />
        <rect x="84" y="40" width="20" height="46" rx="4" fill="#baddea" />
      </g>
    </svg>
  );
}

export default function AuthView({ onAuthenticated }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [signUp, setSignUp] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    news: false,
    terms: false,
  });
  const [error, setError] = useState("");

  function handleSignIn() {
    if (!signIn.email.trim() || !signIn.password) {
      setError("Merci de renseigner votre email et votre mot de passe.");
      return;
    }
    setError("");
    onAuthenticated?.();
  }

  function handleSignUp() {
    if (
      !signUp.firstName.trim() ||
      !signUp.lastName.trim() ||
      !signUp.email.trim()
    ) {
      setError("Merci de compléter votre nom, prénom et email.");
      return;
    }
    if (!signUp.password || signUp.password !== signUp.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!signUp.terms) {
      setError("Merci d'accepter les conditions d'utilisation.");
      return;
    }
    setError("");
    onAuthenticated?.();
  }

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        {/* ── Left: brand panel ── */}
        <div style={styles.brandPanel}>
          <OrbitMark />
          <div style={styles.brandTop}>
            <div style={styles.logoChip}>
              <img src={LOGO_URL} alt="GTI" style={styles.logoImg} />
            </div>
          </div>

          <div style={styles.brandBody}>
            <p style={styles.brandEyebrow}>LE PORTAIL GTI</p>
            <h1 style={styles.brandTitle}>
              Le pouls de <br /> votre équipe.
            </h1>
            <p style={styles.brandSub}>
              Suivez votre performance, productivité et taches de travail, en un seul endroit.
            </p>
          </div>

          <div></div>
        </div>

        {/* ── Right: form panel ── */}
        <div style={styles.formPanel}>
          {mode === "signin" ? (
            <>
              <h2 style={styles.title}>Bon retour.</h2>
              <p style={styles.subtitle}>Connectez-vous à votre espace GTI.</p>

              <p style={styles.switchLine}>
                Pas encore de compte ?{" "}
                <span
                  style={styles.switchLink}
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                >
                  Créer un compte
                </span>
              </p>

              <div style={styles.form}>
                <TextField
                  label="Email"
                  type="email"
                  value={signIn.email}
                  onChange={(v) => setSignIn((s) => ({ ...s, email: v }))}
                  placeholder="prenom.nom@gti.com"
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  value={signIn.password}
                  onChange={(v) => setSignIn((s) => ({ ...s, password: v }))}
                  placeholder="••••••••"
                />

                <div style={styles.rowBetween}>
                  <CheckLine
                    checked={signIn.remember}
                    onClick={() =>
                      setSignIn((s) => ({ ...s, remember: !s.remember }))
                    }
                  >
                    Se souvenir de moi
                  </CheckLine>
                  <span style={styles.forgotLink}>Mot de passe oublié ?</span>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                <button style={styles.submitButton} onClick={handleSignIn}>
                  Se connecter <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.title}>Bienvenue.</h2>
              <p style={styles.subtitle}>Créez votre accès au Portail GTI.</p>

              <p style={styles.switchLine}>
                Déjà un compte ?{" "}
                <span
                  style={styles.switchLink}
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                >
                  Se connecter
                </span>
              </p>


              <div style={styles.form}>
                <div style={styles.twoCol}>
                  <TextField
                    label="Prénom"
                    value={signUp.firstName}
                    onChange={(v) => setSignUp((s) => ({ ...s, firstName: v }))}
                    placeholder="Nadia"
                  />
                  <TextField
                    label="Nom"
                    value={signUp.lastName}
                    onChange={(v) => setSignUp((s) => ({ ...s, lastName: v }))}
                    placeholder="Ben Salem"
                  />
                </div>
                <div style={styles.twoCol}>
                  <TextField
                    label="Téléphone"
                    value={signUp.phone}
                    onChange={(v) => setSignUp((s) => ({ ...s, phone: v }))}
                    placeholder="+216 23 456 781"
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={signUp.email}
                    onChange={(v) => setSignUp((s) => ({ ...s, email: v }))}
                    placeholder="prenom.nom@gti.com"
                  />
                </div>
                <div style={styles.twoCol}>
                  <TextField
                    label="Mot de passe"
                    type="password"
                    value={signUp.password}
                    onChange={(v) => setSignUp((s) => ({ ...s, password: v }))}
                    placeholder="••••••••"
                  />
                  <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    value={signUp.confirmPassword}
                    onChange={(v) =>
                      setSignUp((s) => ({ ...s, confirmPassword: v }))
                    }
                    placeholder="••••••••"
                  />
                </div>

                {error && <p style={styles.error}>{error}</p>}

                <button style={styles.submitButton} onClick={handleSignUp}>
                  Créer mon compte <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Theme tokens (GTI palette) ────────────────────────────────────────────
const NAVY = "#1c3f76";
const NAVY_DEEP = "#122a52";
const TERRACOTTA = "#e8451d";
const TEAL = "#6fcdcb";
const ICE = "#daecef";
const TEXT_DARK = "#142543";
const TEXT_MUTED = "#718099";

const styles = {
  shell: {
    position: "fixed",
    inset: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(180deg, #f5f7fb 0%, ${ICE} 130%)`,
    padding: "24px 20px",
    boxSizing: "border-box",
    overflow: "hidden",
    fontFamily: '"DM Sans", sans-serif',
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: 990,
    maxHeight: "94vh",
    background: "#fff",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(20,37,67,0.18)",
  },
  brandPanel: {
    position: "relative",
    flex: "0 0 44%",
    background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
    padding: "40px 40px 36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "#fff",
    overflow: "hidden",
  },
  brandTop: { position: "relative", zIndex: 2 },
  logoChip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    padding: "8px 14px",
  },
  logoImg: { height: 40, display: "block" },
  brandBody: { position: "relative", zIndex: 2, marginTop: 40 },
  brandEyebrow: {
    margin: "0 0 14px",
    fontFamily: '"DM Mono", monospace',
    fontSize: 11,
    letterSpacing: "0.18em",
    color: TEAL,
    fontWeight: 500,
  },
  brandTitle: {
    margin: "0 0 16px",
    fontFamily: "Manrope, sans-serif",
    fontWeight: 800,
    fontSize: 38,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  brandSub: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(255, 255, 255, 0.89)",
    maxWidth: 320,
  },
  brandFooter: {
    position: "relative",
    zIndex: 2,
    margin: 0,
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontFamily: '"DM Mono", monospace',
  },
  formPanel: {
    flex: "1 1 56%",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflowY: "auto",
  },
  title: {
    margin: "0 0 8px",
    fontFamily: "Manrope, sans-serif",
    fontWeight: 800,
    fontSize: 30,
    color: TEXT_DARK,
    letterSpacing: "-0.02em",
  },
  subtitle: { margin: "0 0 18px", fontSize: 13, color: TEXT_MUTED },
  switchLine: { margin: "0 0 28px", fontSize: 13, color: "#3a4150" },
  switchLink: {
    color: TERRACOTTA,
    fontWeight: 700,
    cursor: "pointer",
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: 600, color: "#3a4150" },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e6e8ec",
    background: "#f7f8fa",
    fontSize: 14,
    color: TEXT_DARK,
    outline: "none",
    fontFamily: "inherit",
  },
  rowBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -2,
  },
  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    cursor: "pointer",
  },
  checkBox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    border: "1.5px solid #d7dbe2",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkBoxActive: { background: TERRACOTTA, borderColor: TERRACOTTA },
  checkLabel: { fontSize: 12.5, color: "#3a4150", lineHeight: 1.5 },
  forgotLink: {
    fontSize: 12.5,
    color: NAVY,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    margin: 0,
    fontSize: 12.5,
    color: "#d22929",
    background: "#fdecec",
    padding: "9px 12px",
    borderRadius: 8,
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    padding: "13px 20px",
    borderRadius: 10,
    border: "none",
    background: TERRACOTTA,
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};
