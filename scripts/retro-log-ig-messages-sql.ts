import 'dotenv/config';
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/spectral?schema=public",
});

const EXPORT_DIR = '/home/.z/workspaces/con_AEbB00ElHw0O7fWj/ig_export/inbox';
const MY_NAME = 'Kasper Jaylin Pickett';

async function appendToSheet(artistName, contactMethod, instagramHandle, email) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[google-sheets] GOOGLE_SHEETS_WEBHOOK_URL not set - skipping sheet write');
    return;
  }
  
  const dateContacted = new Date('2026-05-16');
  const dateStr = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateContacted);
  
  const values = [
    artistName,           // A: Artist Name
    "",                   // B
    "",                   // C
    "Social Media",       // D: Contact Method
    instagramHandle || "", // E: IG Handle
    "",                   // F
    "",                   // G
    "",                   // H
    "",                   // I
    "",                   // J
    "",                   // K
    "",                   // L
    dateStr               // M: Date Contacted
  ];
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'appendRow',
        values: JSON.stringify(values)
      }).toString()
    });
    
    if (response.ok) {
      console.log(`[google-sheets] Row appended for "${artistName}"`);
    } else {
      const text = await response.text().catch(() => '');
      console.error(`[google-sheets] Sheet write failed (${response.status}): ${text.slice(0, 100)}`);
    }
  } catch (err) {
    console.error('[google-sheets] Network error:', err);
  }
}

async function processConversations() {
  const folders = fs.readdirSync(EXPORT_DIR);
  let processedCount = 0;
  let messageCount = 0;
  let createdLeadsCount = 0;

  // Yesterday's range: 2026-05-16
  const start = new Date('2026-05-16T00:00:00Z').getTime();
  const end = new Date('2026-05-16T23:59:59Z').getTime();

  console.log(`Processing messages sent between ${new Date(start).toISOString()} and ${new Date(end).toISOString()}...`);

  for (const folder of folders) {
    const folderPath = path.join(EXPORT_DIR, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const messageFile = path.join(folderPath, 'message_1.json');
    if (!fs.existsSync(messageFile)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(messageFile, 'utf-8'));
      const handle = folder.split('_')[0];
      
      const myMessagesYesterday = data.messages.filter(m => 
        m.sender_name === MY_NAME && 
        m.timestamp_ms >= start && 
        m.timestamp_ms <= end
      );

      if (myMessagesYesterday.length === 0) continue;

      // Ensure Artist exists (check by instagramHandle first)
      let artistRes = await pool.query(
        'SELECT id FROM "Artist" WHERE "instagramHandle" = $1',
        [handle]
      );

      let artistId, leadId;
      let artistName = data.title || handle;
      let isNewArtistOrLead = false;

      if (artistRes.rows.length === 0) {
        // Create Artist
        const newArtistRes = await pool.query(
          'INSERT INTO "Artist" (id, name, "instagramHandle", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) ON CONFLICT ("instagramHandle") DO UPDATE SET "updatedAt" = NOW() RETURNING id',
          [crypto.randomUUID(), data.title || handle, handle]
        );
        artistId = newArtistRes.rows[0].id;

        // Create Lead
        const newLeadRes = await pool.query(
          'INSERT INTO "Lead" (id, "artistId", status, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
          [crypto.randomUUID(), artistId, 'NEW']
        );
        leadId = newLeadRes.rows[0].id;
        createdLeadsCount++;
        isNewArtistOrLead = true;
        console.log(`Created new lead for ${handle}`);
      } else {
        artistId = artistRes.rows[0].id;
        // Get existing Lead for this Artist
        let leadCheck = await pool.query(
          'SELECT id FROM "Lead" WHERE "artistId" = $1 LIMIT 1',
          [artistId]
        );
        
        if (leadCheck.rows.length > 0) {
          leadId = leadCheck.rows[0].id;
        } else {
          // Create a new Lead for existing Artist
          const newLeadRes = await pool.query(
            'INSERT INTO "Lead" (id, "artistId", status, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id',
            [crypto.randomUUID(), artistId, 'NEW']
          );
          leadId = newLeadRes.rows[0].id;
          createdLeadsCount++;
          isNewArtistOrLead = true;
          console.log(`Created new lead for existing artist ${handle}`);
        }
      }

      // Write to Google Sheet (only for IG DMs)
      await appendToSheet(artistName, 'Social Media', handle, null);

      for (const msg of myMessagesYesterday) {
        const occurredAt = new Date(msg.timestamp_ms).toISOString();
        
        const dupCheck = await pool.query(
          'SELECT id FROM "Activity" WHERE "leadId" = $1 AND "occurredAt" = $2 AND type = $3',
          [leadId, occurredAt, 'MESSAGE_SENT']
        );

        if (dupCheck.rows.length > 0) continue;

        let note = msg.content;
        if (msg.share) {
          note = `Sent attachment: ${msg.share.link}`;
        }

        await pool.query(
          'INSERT INTO "Activity" (id, "leadId", type, note, "occurredAt", "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
          [crypto.randomUUID(), leadId, 'MESSAGE_SENT', note, occurredAt]
        );
        messageCount++;
      }
      processedCount++;
    } catch (err) {
      console.error(`Error processing ${folder}: ${err.message}`);
    }
  }

  console.log(`\nResults:`);
  console.log(`- Conversations processed: ${processedCount}`);
  console.log(`- Messages logged: ${messageCount}`);
  console.log(`- New leads created: ${createdLeadsCount}`);
}

processConversations()
  .catch(err => console.error('Fatal Error:', err))
  .finally(async () => {
    await pool.end();
  });
