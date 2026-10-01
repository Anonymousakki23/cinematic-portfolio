// Recommendations page configuration.
//
// Filled in during setup — edit these values, rebuild, and redeploy.
//
// GOOGLE FORM (submission backend)
//  1. Form ID and entry IDs come from the "Website recommendation" Google Form.
//  2. The form posts straight to Google's formResponse endpoint — no server needed.
// PUBLISHED SHEET (display backend)
//  1. In the form: Responses tab → Link to Sheets.
//  2. In the sheet: add a column titled exactly "Publish", fill YES for rows to show.
//  3. In the sheet: File → Share → Publish to web (entire "Form Responses" sheet).
//  4. Paste the sheet ID below. The page fetches the CSV and renders only
//     rows where Publish = YES, so nothing appears before Akshay approves it.

export const RECOMMENDATIONS_CONFIG = {
  formAction:
    "https://docs.google.com/forms/d/e/1FAIpQLSeDbhwAflfGb5gRFFOzyRJGT6CTlXL4ur2AwDSfRTm77q01LA/formResponse",
  // entry IDs for: name, role, relationship, text, consent
  fields: {
    name: "entry.1696717503",
    role: "entry.1026003662",
    relationship: "entry.409906479",
    text: "entry.2097120316",
    consent: "entry.1828064959",
  },
  consentValue:
    "I agree to have my name, role, and recommendation published on this website.",
  sheetId: "12EHsMnY27FtBjwEYl_rYiB76m_WBcsyGbmc4ahXSyF0",
  sheetName: "Form Responses 1",
};

export function recommendationsCsvUrl(): string {
  const { sheetId, sheetName } = RECOMMENDATIONS_CONFIG;
  return (
    `https://docs.google.com/spreadsheets/d/${sheetId}` +
    `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  );
}

export interface CommunityRecommendation {
  name: string;
  role: string;
  relationship: string;
  text: string;
  date: string;
}

// Static community recommendations — shown alongside (and before) the
// sheet-fed ones. Currently empty: the published sheet is the source of
// truth. Add entries here only for curated items that bypass the sheet.
export const STATIC_COMMUNITY: CommunityRecommendation[] = [];

// Minimal CSV parser that handles quoted fields (what Google exports).
export function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (inQuotes) {
      if (c === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Google Forms response sheets: Timestamp, Name, Role, Relationship, Text, Consent, + Publish.
export function toCommunityRecommendations(csv: string): CommunityRecommendation[] {
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (names: string[]) =>
    header.findIndex((h) => names.some((n) => h.includes(n)));
  const iName = idx(["your name", "name"]);
  const iRole = idx(["role"]);
  const iRel = idx(["worked together", "relationship"]);
  const iText = idx(["recommendation"]);
  const iPub = idx(["publish"]);
  const iTs = idx(["timestamp"]);
  return rows
    .slice(1)
    .filter((r) => {
      const pub = (r[iPub] ?? "").trim().toUpperCase();
      const text = (r[iText] ?? "").trim();
      return pub === "YES" && text.length > 0;
    })
    .map((r) => ({
      name: (r[iName] ?? "").trim() || "Anonymous",
      role: (r[iRole] ?? "").trim(),
      relationship: (r[iRel] ?? "").trim(),
      text: (r[iText] ?? "").trim(),
      date: (r[iTs] ?? "").trim().split(" ")[0] || "",
    }));
}

export function isFormConfigured(): boolean {
  return !RECOMMENDATIONS_CONFIG.formAction.includes("__FORM_ID__");
}

export function isSheetConfigured(): boolean {
  return !RECOMMENDATIONS_CONFIG.sheetId.includes("__");
}

// Kept for backwards compatibility; prefer isFormConfigured/isSheetConfigured.
export function isBackendConfigured(): boolean {
  return isFormConfigured();
}
