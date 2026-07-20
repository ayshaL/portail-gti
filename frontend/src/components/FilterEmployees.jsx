import { useState } from "react";
import {
  X,
  ChevronDown,
  User,
  Footprints,
  GraduationCap,
  Calendar,
} from "lucide-react";

// ── Default (empty) filter state ────────────────────────────────────────
export const emptyFilters = {
  profil: "",
  statut: "",
  structure: "All",
  fonction: "All",
  senioriteMode: "Seniorité", // "Seniorité" | "Experience globale"
  niveaux: [], // Junior / Confirmé / Senior — empty = all
  groupe: "All",
  situationContractuelle: "All",
  supHierarchique: "All",
  departement: "All",
  badge: "",
  competences: "All",
  enAlternance: "",
  ecole: "All",
  diplome: "All",
  situationGti: "All",
  projetAffecte: "All",
  datePriseDu: "",
  datePriseAu: "",
  dateDebutContratDu: "",
  dateDebutContratAu: "",
};

// ── Filter function — apply `filters` (+ optional free-text query) to a list ─
// Every check falls back gracefully if the field isn't present on an employee.
export function filterEmployees(list, filters, query = "") {
  const q = query.trim().toLowerCase();

  return list.filter((emp) => {
    const matchesQuery =
      !q ||
      `${emp.name ?? ""} ${emp.id ?? ""} ${emp.fonction ?? ""}`
        .toLowerCase()
        .includes(q);

    const matchesProfil = !filters.profil || emp.profil === filters.profil;
    const matchesStatut = !filters.statut || emp.statut === filters.statut;
    const matchesDept =
      filters.departement === "All" || emp.department === filters.departement;
    const matchesFonction =
      filters.fonction === "All" || emp.fonction === filters.fonction;
    const matchesNiveaux =
      filters.niveaux.length === 0 || filters.niveaux.includes(emp.seniorite);
    const matchesGroupe =
      filters.groupe === "All" || emp.groupe === filters.groupe;
    const matchesSituation =
      filters.situationContractuelle === "All" ||
      emp.situationContractuelle === filters.situationContractuelle;
    const matchesSup =
      filters.supHierarchique === "All" ||
      emp.supHierarchique === filters.supHierarchique;
    const matchesCompetences =
      filters.competences === "All" ||
      (emp.competences ?? []).includes(filters.competences);
    const matchesAlternance =
      filters.enAlternance === "" ||
      emp.parcours?.academique?.enAlternance ===
        (filters.enAlternance === "Oui");
    const matchesEcole =
      filters.ecole === "All" ||
      emp.parcours?.academique?.ecole === filters.ecole;
    const matchesDiplome =
      filters.diplome === "All" ||
      emp.parcours?.academique?.diplome === filters.diplome;
    const matchesSituationGti =
      filters.situationGti === "All" ||
      emp.parcours?.gti?.situation === filters.situationGti;
    const matchesProjet =
      filters.projetAffecte === "All" ||
      emp.parcours?.gti?.projetAffecte === filters.projetAffecte;

    return (
      matchesQuery &&
      matchesProfil &&
      matchesStatut &&
      matchesFonction &&
      matchesNiveaux &&
      matchesGroupe &&
      matchesSituation &&
      matchesSup &&
      matchesDept &&
      matchesCompetences &&
      matchesAlternance &&
      matchesEcole &&
      matchesDiplome &&
      matchesSituationGti &&
      matchesProjet
    );
  });
}

// Build a "All" + unique-values dropdown list from a (possibly nested) field path.
// Skips employees missing the field, so it degrades gracefully with partial data.
function unique(list, path) {
  const get = (obj) =>
    path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  return ["All", ...new Set(list.map(get).filter(Boolean))];
}

export function buildFilterOptions(employees) {
  return {
    fonctions: unique(employees, "fonction"),
    groupes: unique(employees, "groupe"),
    situations: unique(employees, "situationContractuelle"),
    sups: unique(employees, "supHierarchique"),
    departements: unique(employees, "departement"),
    competences: [
      "All",
      ...new Set(employees.flatMap((e) => e.competences ?? [])),
    ],
    situationsGti: unique(employees, "parcours.gti.situation"),
    projets: unique(employees, "parcours.gti.projetAffecte"),
    ecoles: unique(employees, "parcours.academique.ecole"),
    diplomes: unique(employees, "parcours.academique.diplome"),
  };
}

// ── Small building blocks ───────────────────────────────────────────────
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

function Checkbox({ label, checked, onClick }) {
  return (
    <div style={styles.checkItem} onClick={onClick}>
      <span
        style={{
          ...styles.checkBox,
          ...(checked ? styles.checkBoxActive : {}),
        }}
      >
        ✓
      </span>
      <span style={styles.checkLabel}>{label}</span>
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

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <input
        style={styles.textInput}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function DateField({ label, value, onChange, placeholder, active }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>{label}</label>
      <div
        style={{ ...styles.dateWrap, ...(active ? styles.dateWrapActive : {}) }}
      >
        <Calendar size={15} color={active ? "#e96a4b" : "#9aa1ad"} />
        <input
          style={styles.dateInput}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// ── FilterEmployees modal ────────────────────────────────────────────────
// Props:
//   open            - boolean, whether the modal is visible
//   onClose         - called when the user dismisses without applying
//   initialFilters  - the filters currently applied (used to seed the draft)
//   onApply(filters)- called with the new filters when "Chercher" is clicked
//   employees       - full employee list, used only to derive dropdown options
export default function FilterEmployees({
  open,
  onClose,
  initialFilters,
  onApply,
  employees,
}) {
  const [draft, setDraft] = useState(initialFilters ?? emptyFilters);
  const [tab, setTab] = useState("info"); // "info" | "parcours"
  const options = buildFilterOptions(employees ?? []);

  if (!open) return null;

  const toggleNiveau = (level) => {
    setDraft((d) => ({
      ...d,
      niveaux: d.niveaux.includes(level)
        ? d.niveaux.filter((l) => l !== level)
        : [...d.niveaux, level],
    }));
  };

  function handleApply() {
    onApply(draft);
    onClose();
  }
  function handleReset() {
    setDraft(emptyFilters);
    onApply(emptyFilters);
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={22} />
        </button>

        <h2 style={styles.modalTitle}>Filtre</h2>

        {/* Profil */}
        <div style={styles.block}>
          <span style={styles.blockLabel}>Profil</span>
          <div style={styles.radioRow}>
            <Radio
              label="Collaborateur"
              checked={draft.profil === "Collaborateur"}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  profil: d.profil === "Collaborateur" ? "" : "Collaborateur",
                }))
              }
            />
            <Radio
              label="Stagiare"
              checked={draft.profil === "Stagiare"}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  profil: d.profil === "Stagiare" ? "" : "Stagiare",
                }))
              }
            />
          </div>
        </div>

        {/* Statut */}
        <div style={styles.block}>
          <span style={styles.blockLabel}>Statut</span>
          <div style={styles.radioRow}>
            <Radio
              label="Actif"
              checked={draft.statut === "Actif"}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  statut: d.statut === "Actif" ? "" : "Actif",
                }))
              }
            />
            <Radio
              label="Inactif"
              checked={draft.statut === "Inactif"}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  statut: d.statut === "Inactif" ? "" : "Inactif",
                }))
              }
            />
          </div>
        </div>

        {/* Structure / Fonction */}
        <div style={styles.twoCol}>
          <SelectField
            label="Département"
            value={draft.departement}
            onChange={(v) => setDraft((d) => ({ ...d, departement: v }))}
            options={options.departements}
          />
          <SelectField
            label="Fonction"
            value={draft.fonction}
            onChange={(v) => setDraft((d) => ({ ...d, fonction: v }))}
            options={options.fonctions}
          />
        </div>

        {/* Seniorité mode */}
        <div style={styles.radioRow}>
          <Radio
            label="Seniroté"
            checked={draft.senioriteMode === "Seniorité"}
            onClick={() =>
              setDraft((d) => ({ ...d, senioriteMode: "Seniorité" }))
            }
          />
          <Radio
            label="Experience global"
            checked={draft.senioriteMode === "Experience globale"}
            onClick={() =>
              setDraft((d) => ({ ...d, senioriteMode: "Experience globale" }))
            }
          />
        </div>

        {/* Seniorité checkboxes */}
        <div style={styles.senioriteBox}>
          <span style={styles.blockLabel}>Seniorité</span>
          <div style={styles.checkRow}>
            {["Junior", "Confirmé", "Senior"].map((level) => (
              <Checkbox
                key={level}
                label={level}
                checked={draft.niveaux.includes(level)}
                onClick={() => toggleNiveau(level)}
              />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          <button
            style={{
              ...styles.tabButton,
              ...(tab === "info" ? styles.tabButtonActive : {}),
            }}
            onClick={() => setTab("info")}
          >
            <User size={15} /> Information professionelle
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(tab === "parcours" ? styles.tabButtonActive : {}),
            }}
            onClick={() => setTab("parcours")}
          >
            <User size={15} /> Parcours
          </button>
        </div>
        <div style={styles.tabDivider} />

        {tab === "info" ? (
          <div style={styles.twoCol}>
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
              label="Supérieure hiérarchique"
              value={draft.supHierarchique}
              onChange={(v) => setDraft((d) => ({ ...d, supHierarchique: v }))}
              options={options.sups}
            />
            <SelectField
              label="Competences"
              value={draft.competences}
              onChange={(v) => setDraft((d) => ({ ...d, competences: v }))}
              options={options.competences}
            />
          </div>
        ) : (
          <>
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <Footprints size={16} color="#e96a4b" />
                <span style={styles.sectionTitle}>Parcours GTI</span>
              </div>
              <div style={styles.twoCol}>
                <SelectField
                  label="Situation"
                  value={draft.situationGti}
                  onChange={(v) => setDraft((d) => ({ ...d, situationGti: v }))}
                  options={options.situationsGti}
                />
                <SelectField
                  label="Projet affectés"
                  value={draft.projetAffecte}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, projetAffecte: v }))
                  }
                  options={options.projets}
                />
                <DateField
                  label="Date prise du poste du"
                  value={draft.datePriseDu}
                  onChange={(v) => setDraft((d) => ({ ...d, datePriseDu: v }))}
                  placeholder="01.01.2020"
                />
                <DateField
                  label="Date prise du poste au"
                  value={draft.datePriseAu}
                  onChange={(v) => setDraft((d) => ({ ...d, datePriseAu: v }))}
                  placeholder="01.03.2021"
                  active
                />
                <DateField
                  label="Date debut contrat du"
                  value={draft.dateDebutContratDu}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, dateDebutContratDu: v }))
                  }
                  placeholder="01.01.2020"
                />
                <DateField
                  label="Date debut contrat au"
                  value={draft.dateDebutContratAu}
                  onChange={(v) =>
                    setDraft((d) => ({ ...d, dateDebutContratAu: v }))
                  }
                  placeholder="01.03.2021"
                  active
                />
              </div>
            </div>

            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <GraduationCap size={16} color="#e96a4b" />
                <span style={styles.sectionTitle}>Parcours academique</span>
              </div>
              <div style={styles.radioRow}>
                <Radio
                  label="En alternance"
                  checked={draft.enAlternance === "Oui"}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      enAlternance: d.enAlternance === "Oui" ? "" : "Oui",
                    }))
                  }
                />
              </div>
              <div style={styles.twoCol}>
                <SelectField
                  label="Ecole"
                  value={draft.ecole}
                  onChange={(v) => setDraft((d) => ({ ...d, ecole: v }))}
                  options={options.ecoles}
                />
                <SelectField
                  label="Diplome"
                  value={draft.diplome}
                  onChange={(v) => setDraft((d) => ({ ...d, diplome: v }))}
                  options={options.diplomes}
                />
              </div>
            </div>
          </>
        )}

        <div style={styles.modalFooter}>
          <button style={styles.resetButton} onClick={handleReset}>
            Initialiser
          </button>
          <button style={styles.searchButton} onClick={handleApply}>
            Chercher
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
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
  dateWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid #e6e8ec",
    padding: "8px 2px",
  },
  dateWrapActive: { borderBottomColor: ORANGE },
  dateInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    color: "#3a4150",
    width: "100%",
  },
  senioriteBox: {
    border: "1px solid #eceef2",
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "22px",
  },
  checkRow: {
    display: "flex",
    gap: "32px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  checkBox: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    background: "#c8ccd3",
    color: "transparent",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxActive: { background: ORANGE, color: "#fff" },
  checkLabel: { fontSize: "14px", color: "#3a4150" },
  tabRow: { display: "flex", gap: "28px", marginTop: "6px" },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    padding: "10px 2px",
    fontSize: "14px",
    color: "#9aa1ad",
    cursor: "pointer",
  },
  tabButtonActive: {
    color: ORANGE,
    fontWeight: 700,
    borderBottom: `2px solid ${ORANGE}`,
  },
  tabDivider: { height: "1px", background: "#eef0f3", marginBottom: "20px" },
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
