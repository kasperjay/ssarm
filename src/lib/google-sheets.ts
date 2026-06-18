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
  CONTACT_NAME: 1,
  PHONE: 2,
  SOCIAL_MEDIA: 3,
  EMAIL: 4,
  WEBSITE: 5,
  RESPONDED: 6,
  BOOKED: 7,
  RECORDED: 8,
  CLIENT: 9,
  MONEY_MADE: 10,
  NOTES: 11,
  DATE_CONTACTED: 12,
} as const;

export type ContactMethod = "Email" | "Social Media" | "Phone" | "Other";

export interface ContactRow {
  artistName: string;
  contactMethod: ContactMethod;
  instagramHandle?: string | null;
  email?: string | null;
  website?: string | null;
  messageText?: string | null;
  dateContacted?: Date;
}

/**
 * Infer the primary contact method based on available channels.
 */
export function inferContactMethod(opts: { hasEmail: boolean }): ContactMethod {
  return opts.hasEmail ? "Email" : "Social Media";
}

/**
 * Append a row to the Contact Log Google Sheet via the deployed Apps Script URL.
 */
export async function appendContactRow(row: ContactRow) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[google-sheets] GOOGLE_SHEETS_WEBHOOK_URL not set — skipping sheet append.");
    return;
  }

  const formattedDate = row.dateContacted
    ? row.dateContacted.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const values = [
    row.artistName,                                     // A: Artist Contacted
    "",                                                 // B: Contact Name
    "",                                                 // C: Phone
    row.instagramHandle ?? "",                          // D: Social Media
    row.email ?? "",                                    // E: Email
    row.website ?? "",                                  // F: Website
    "",                                                 // G: Responded (blank until reply)
    "",                                                 // H: Booked
    "",                                                 // I: Recorded
    "",                                                 // J: Client
    "",                                                 // K: Money Made
    (row.messageText ?? "").slice(0, 500),              // L: Notes (truncated)
    formattedDate,                                      // M: Date Contacted
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
      const text = await response.text().catch(() => "No response body");
      console.error(`[google-sheets] Append failed (${response.status}):`, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[google-sheets] Append error:", err instanceof Error ? err.message : err);
  }
}

/**
 * Mark an artist's row as responded in the sheet by putting "✓" in column G.
 * Finds the most recent matching row by artist name in column A.
 */
export async function markRespondedRow(artistName: string) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[google-sheets] GOOGLE_SHEETS_WEBHOOK_URL not set — skipping markResponded.");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "markResponded",
        artistName,
      }).toString(),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "No response body");
      console.error(`[google-sheets] markResponded failed (${response.status}):`, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[google-sheets] markResponded error:", err instanceof Error ? err.message : err);
  }
}
