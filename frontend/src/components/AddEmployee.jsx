import { useState } from "react";
import { X, ChevronDown, User, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { buildFilterOptions } from "./FilterEmployees";

// ── Default (empty) draft for a new employee ────────────────────────────
const emptyDraft = {
  name: "",
  email: "",
  phone: "",
  fonction: "",
  departement: "All",
  groupe: "All",
  situationContractuelle: "All",
  supHierarchique: "All",
  profil: "Collaborateur",
  statut: "Actif",
  diploma: "",
  ecole: "",
};

const AVATAR_COLORS = ["#e96a4b", "#4b8ee9", "#22c07a", "#a978e0", "#e9b84b"];

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Picks the next free 3-digit id from the existing roster (e.g. "042" -> "043").
function nextId(employees) {
  const max = employees.reduce((acc, emp) => {
    const n = parseInt(emp.id, 10);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return String(max + 1).padStart(3, "0");
}

// ── Small building blocks (same look as FilterEmployees) ─────────────────
function Radio({ label, checked, onClick }) {
  return (
    <div style={styles.radioItem} onClick={onClick}>
      <span
        style={{
          ...styles.radioOuter,
          ...(checked ? styles.radioOuterActive : {}),
        }}
      >
        {checked && <span style={styles.radioInner} />}
      </span>
      <span style={styles.radioLabel}>{label}</span>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.selectWrap}>
        <select
          style={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "All" ? "Choisir" : opt}
            </option>
          ))}
        </select>
        <ChevronDown size={16} style={styles.selectChevron} />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, error }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        style={{ ...styles.textInput, ...(error ? styles.textInputError : {}) }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

// ── AddEmployee modal ─────────────────────────────────────────────────────
// Props:
//   open      - boolean, whether the modal is visible
//   onClose   - called when the user dismisses without saving
//   onAdd(emp)- called with the newly built employee object on submit
//   employees - full employee list, used to derive dropdown options + next id
export default function AddEmployee({ open, onClose, onAdd, employees }) {
  const [draft, setDraft] = useState(emptyDraft);
  const [errors, setErrors] = useState({});
  const options = buildFilterOptions(employees ?? []);

  if (!open) return null;

  function handleClose() {
    setDraft(emptyDraft);
    setErrors({});
    onClose();
  }

  function handleSubmit() {
    const nextErrors = {};
    if (!draft.name.trim()) nextErrors.name = "Le nom est requis";
    if (!draft.email.trim()) nextErrors.email = "L'email est requis";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const roster = employees ?? [];
    const newEmployee = {
      id: nextId(roster),
      name: draft.name.trim(),
      initials: initialsOf(draft.name),
      color: AVATAR_COLORS[roster.length % AVATAR_COLORS.length],
      profil: draft.profil,
      statut: draft.statut,
      workMode: "On site",
      onLeave: false,
      fonction: draft.fonction,
      departement: draft.departement === "All" ? "" : draft.departement,
      groupe: draft.groupe === "All" ? "" : draft.groupe,
      situationContractuelle:
        draft.situationContractuelle === "All" ? "" : draft.situationContractuelle,
      supHierarchique:
        draft.supHierarchique === "All" ? "" : draft.supHierarchique,
      score: 0,
      productivity: 0,
      quality: 0,
      attendance: 0,
      diploma: draft.diploma,
      email: draft.email.trim(),
      phone: draft.phone,
    };

    onAdd(newEmployee);
    handleClose();
  }

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.closeButton}
          onClick={handleClose}
          aria-label="Fermer"
        >
          <X size={22} />
        </button>

        <h2 style={styles.modalTitle}>Ajouter un Collaborateur</h2>

        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <User size={16} color="#e96a4b" />
            <span style={styles.sectionTitle}>Identité</span>
          </div>
          <div style={styles.twoCol}>
            <TextField
              label="Nom complet"
              value={draft.name}
              onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
              placeholder="Ex: Nadia Ben Salem"
              error={errors.name}
            />
            <TextField
              label="Email"
              value={draft.email}
              onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
              placeholder="nom.prenom@gpi.com"
              error={errors.email}
            />
            <TextField
              label="Téléphone"
              value={draft.phone}
              onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
              placeholder="+216 23 456 781"
            />
          </div>
        </div>

        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <BriefcaseBusiness size={16} color="#e96a4b" />
            <span style={styles.sectionTitle}>Poste & Organisation</span>
          </div>
          <div style={styles.twoCol}>
            <TextField
              label="Fonction"
              value={draft.fonction}
              onChange={(v) => setDraft((d) => ({ ...d, fonction: v }))}
              placeholder="Ex: Développeur"
            />
            <SelectField
              label="Département"
              value={draft.departement}
              onChange={(v) => setDraft((d) => ({ ...d, departement: v }))}
              options={options.departements}
            />
            <SelectField
              label="Groupe"
              value={draft.groupe}
              onChange={(v) => setDraft((d) => ({ ...d, groupe: v }))}
              options={options.groupes}
            />
            <SelectField
              label="Situation contractuelle"
              value={draft.situationContractuelle}
              onChange={(v) =>
                setDraft((d) => ({ ...d, situationContractuelle: v }))
              }
              options={options.situations}
            />
            <SelectField
              label="Supérieur hiérarchique"
              value={draft.supHierarchique}
              onChange={(v) => setDraft((d) => ({ ...d, supHierarchique: v }))}
              options={options.sups}
            />
          </div>
        </div>

        <div style={styles.block}>
          <span style={styles.blockLabel}>Profil</span>
          <div style={styles.radioRow}>
            <Radio
              label="Collaborateur"
              checked={draft.profil === "Collaborateur"}
              onClick={() => setDraft((d) => ({ ...d, profil: "Collaborateur" }))}
            />
            <Radio
              label="Stagiare"
              checked={draft.profil === "Stagiare"}
              onClick={() => setDraft((d) => ({ ...d, profil: "Stagiare" }))}
            />
          </div>
        </div>

        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <GraduationCap size={16} color="#e96a4b" />
            <span style={styles.sectionTitle}>Parcours académique</span>
          </div>
          <div style={styles.twoCol}>
            <TextField
              label="Ecole"
              value={draft.ecole}
              onChange={(v) => setDraft((d) => ({ ...d, ecole: v }))}
              placeholder="Ex: ENSI"
            />
            <TextField
              label="Diplôme"
              value={draft.diploma}
              onChange={(v) => setDraft((d) => ({ ...d, diploma: v }))}
              placeholder="Ex: MSc Cloud Computing"
            />
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.resetButton} onClick={handleClose}>
            Annuler
          </button>
          <button style={styles.searchButton} onClick={handleSubmit}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Styles (matches FilterEmployees.jsx) ─────────────────────────────────
const ORANGE = "#e96a4b";
const NAVY = "#1b2333";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(20, 24, 33, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 16px",
    overflowY: "auto",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "620px",
    padding: "36px 40px 28px",
    position: "relative",
    boxShadow: "0 20px 60px rgba(20,24,33,0.25)",
  },
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#b3b8c2",
  },
  modalTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: NAVY,
    margin: "0 0 24px",
  },
  block: { marginBottom: "20px" },
  blockLabel: {
    fontSize: "14px",
    fontWeight: 700,
    color: NAVY,
    display: "block",
    marginBottom: "10px",
  },
  radioRow: {
    display: "flex",
    gap: "36px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  radioItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  radioOuter: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #d7dbe2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioOuterActive: { borderColor: ORANGE },
  radioInner: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: ORANGE,
  },
  radioLabel: { fontSize: "15px", color: "#3a4150" },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px 24px",
    marginBottom: "10px",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  fieldLabel: { fontSize: "13px", color: "#3a4150", fontWeight: 600 },
  selectWrap: { position: "relative" },
  select: {
    width: "100%",
    appearance: "none",
    padding: "12px 36px 12px 14px",
    borderRadius: "9px",
    border: "1px solid #e6e8ec",
    background: "#f7f8fa",
    fontSize: "14px",
    color: "#3a4150",
    cursor: "pointer",
  },
  selectChevron: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8a94a6",
    pointerEvents: "none",
  },
  textInput: {
    padding: "12px 14px",
    borderRadius: "9px",
    border: "1px solid #e6e8ec",
    background: "#f7f8fa",
    fontSize: "14px",
    color: "#3a4150",
    outline: "none",
  },
  textInputError: {
    borderColor: "#d22929",
  },
  errorText: {
    fontSize: "12px",
    color: "#d22929",
  },
  sectionCard: {
    border: "1px solid #eceef2",
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "18px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  sectionTitle: { fontSize: "14px", fontWeight: 700, color: NAVY },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  resetButton: {
    padding: "12px 26px",
    borderRadius: "9px",
    border: "1px solid #e1e4e9",
    background: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    color: NAVY,
    cursor: "pointer",
  },
  searchButton: {
    padding: "12px 26px",
    borderRadius: "9px",
    border: "none",
    background: ORANGE,
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};