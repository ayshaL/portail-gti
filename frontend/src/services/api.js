import { employees as mockEmployees } from "../data/dashboardData";

const API_BASE = "http://localhost:8000";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`API failed: ${response.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

// gets all employees with their backend profile and latest score
export async function getEmployees() {
  const employeeIds = await fetchJson("/employees/");

  if (!Array.isArray(employeeIds)) {
    return [];
  }

  const employees = await Promise.all(
    employeeIds.map(async (employeeId) => {
      try {
        const profile = await fetchJson(`/employees/${employeeId}/profile`);
        const latest = await fetchJson(`/employees/${employeeId}/latest`).catch(
          () => null,
        );
        const mock = mockEmployees.find((item) => item.name === profile?.name);

        return {
          ...mock,
          ...profile,
          id: `${String(profile.usr_matricule).padStart(3, "0")}`,
          dbId: profile.usr_matricule,
          department:
            profile?.departement ??
            profile?.department ??
            mock?.department ??
            mock?.departement,
          fonction: profile?.fonction ?? mock?.fonction ?? "",
          diploma: profile?.diploma ?? mock?.diploma ?? "",
          email: profile?.email ?? mock?.email ?? "",
          phone: profile?.phone ?? mock?.phone ?? "",
          score: latest?.score ?? mock?.score ?? 0,
          productivity: latest?.prod ?? mock?.productivity ?? 0,
          quality: latest?.qual ?? mock?.quality ?? 0,
          depassement: latest?.depassement ?? mock?.depassement ?? 0,
          assiduite: latest?.assiduite ?? mock?.assiduite ?? 0,        };
      } catch {
        return null;
      }
    }),
  );

  return employees.filter(Boolean);
}

// gets history over last months for a specific employee id
export async function getEmployeeRecords(employeeId) {
  return fetchJson(`/employees/${employeeId}`);
}

// gets details (name, department, etc.) for a specific employee id
export async function getEmployeeDetails(employeeId) {
  return fetchJson(`/employees/${employeeId}/profile`);
}

// gets score prediction for a specific employee id
export async function getEmployeePrediction(employeeId) {
  const response = await fetch(`${API_BASE}/predictions/${employeeId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prediction API failed: ${response.status} ${errorText}`);
  }
  return response.json();
}
