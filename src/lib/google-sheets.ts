/**
 * Google Sheets row appender — calls a Google Apps Script Web App endpoint.
 *
 * The Apps Script must expose a `doPost(e)` that reads `e.parameter.action === "appendRow"`
 * and appends `e.parameter.values` (JSON array) as a new row to the target sheet.
 *
 * Setup:
 * 1. Open the target spreadsheet → Extensions → Apps Script
 * 2. Paste the contents of APPS_SCRIPT.md into the editor
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone (with the URL, no sign-in required)
 * 3. Copy the Web App URL and save it as GOOGLE_SHEETS_WEBHOOK_URL in .env
 */

const SHEET_COLUMNS = {
  ARTIST_CONTACTED: 0,
  SOCIAL_MEDIA: 1,
  EMAIL: 2,
  DATE_CONTACTED: 3,
} as const;

export type ContactMethod = "Social Media" | "Email";

export interface ContactRow {
  artistName: string;
  contactMethod: ContactMethod;
  instagramHandle?: string | null;
  email?: string | null;
  dateContacted?: Date;
}

/**
 * Appends a single row to the configured Google Sheet.
 * Safely no-ops if the webhook URL is not set — contact logging never blocks outreach.
 */
export async function appendContactRow(row: ContactRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[google-sheets] GOOGLE_SHEETS_WEBHOOK_URL not set — skipping sheet write");
    return;
  }

  const dateContacted = row.dateContacted ?? new Date();
  const formattedDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateContacted);

  // Sheet has 13 columns: A=Artist, B=Contact Name, C=Phone, D=Social Media, E=Email, F=Website,
  // G=Responded, H=Booked, I=Recorded, J=Client, K=Money Made, L=Notes, M=Date Contacted
  // Only A (artist name), D (handle), E (email), M (date) are populated.
  const values: [string, string, string, string, string, string, string, string, string, string, string, string, string] = [
    row.artistName,     // A: Artist Contacted
    "",                 // B: Contact Name
    "",                 // C: Phone
    row.contactMethod === "Social Media" ? (row.instagramHandle ?? "") : "", // D: Social Media
    row.contactMethod === "Email" ? (row.email ?? "") : "",                // E: Email
    "",                 // F: Website
    "",                 // G: Responded
    "",                 // H: Booked
    "",                 // I: Recorded
    "",                 // J: Client
    "",                 // K: Money Made
    "",                 // L: Notes
    formattedDate,      // M: Date Contacted
  ];

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "appendRow",
        values: JSON.stringify(values),
      }).toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[google-sheets] Sheet write failed (${response.status}): ${text}`);
    } else {
      console.info(`[google-sheets] Row appended for "${row.artistName}" via ${row.contactMethod}`);
    }
  } catch (err) {
    // Never let sheet errors break the outreach flow
    console.error("[google-sheets] Network error writing to sheet:", err);
  }
}

/**
 * Infers the best contact method for a lead.
 * Prefers Email if available, otherwise Social Media.
 */
export function inferContactMethod(params: {
  hasEmail: boolean;
  preferredMethod?: ContactMethod;
}): ContactMethod {
  if (params.preferredMethod) return params.preferredMethod;
  return params.hasEmail ? "Email" : "Social Media";
}
