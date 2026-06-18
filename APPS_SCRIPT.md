# Google Apps Script — Append Row to Contact Sheet

## Setup Instructions

### 1. Open the Apps Script editor
In your target spreadsheet:
- Click **Extensions** → **Apps Script**
- This opens the Apps Script editor with a blank `Code.gs` file

### 2. Replace the default Code.gs contents
Delete everything in the editor and paste the following:

```js
/**
 * Web App entry point — handles POST requests to append a row or mark replied.
 *
 * Supported actions:
 *   action=appendRow  → values=JSON.stringify([...13 elements...])
 *   action=markResponded → artistName=string
 *
 * Security: The script is deployed as "Anyone" access, so the URL is public.
 *           If you ever need to revoke access, just delete the deployment.
 */

/**
 * Returns the first sheet named "Contact Log" (or falls back to the first sheet).
 * Update the sheet name if yours is different.
 */
function getContactSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Contact Log") || ss.getSheets()[0];
  return sheet;
}

/**
 * Appends a row to the sheet. Empty strings fill the unused columns so the
 * array aligns with the correct column positions.
 *
 * Columns: A=Artist, B=Contact Name, C=Phone, D=Social Media, E=Email,
 * F=Website, G=Responded, H=Booked, I=Recorded, J=Client, K=Money Made,
 * L=Notes, M=Date Contacted
 */
function appendRow(values) {
  if (!values || !Array.isArray(values)) {
    throw new Error("values must be an array");
  }
  const sheet = getContactSheet();
  sheet.appendRow(values);
}

/**
 * Finds the most recent row matching the artist name in column A and
 * sets column G (Responded) to "✓". Returns true if a match was found.
 */
function markResponded(artistName) {
  const sheet = getContactSheet();
  const data = sheet.getDataRange().getValues();

  // Walk in reverse so we mark the most recent contact row
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][0] === artistName) {
      sheet.getRange(i + 1, 7).setValue("✓");
      return true;
    }
  }
  return false;
}

/**
 * Main entry point for POST requests from the server.
 */
function doPost(e) {
  try {
    const action = e.parameter.action;

    if (action === "appendRow") {
      const raw = e.parameter.values;
      if (!raw) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: "Missing values parameter" })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const values = JSON.parse(raw);
      appendRow(values);

      return ContentService.createTextOutput(
        JSON.stringify({ status: "ok" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "markResponded") {
      const artistName = e.parameter.artistName;
      if (!artistName) {
        return ContentService.createTextOutput(
          JSON.stringify({ error: "Missing artistName parameter" })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      const found = markResponded(artistName);
      return ContentService.createTextOutput(
        JSON.stringify({ status: found ? "ok" : "notFound" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ error: "Unknown action: " + action })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET requests return a simple confirmation (useful when testing the URL
 * in a browser before wiring up the server).
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "Sheet Contact Row Writer — POST action=appendRow or action=markResponded."
  );
}
```

### 3. Deploy the Web App

1. Click **Deploy** → **New deployment** at the top right
2. For "Select type," choose **Web app**
3. Fill in:
   - **Description:** `Contact Row Writer`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### 4. Add the URL to your `.env`

```
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
```

### 5. Restart the server
```bash
Ctrl+C  # stop the dev server
npm run dev
```
