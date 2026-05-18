require("dotenv").config();
const { prisma } = require("../src/lib/agent-runner");
const WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

async function main() {
  if (!WEBHOOK_URL) {
    console.error("❌ Error: GOOGLE_SHEETS_WEBHOOK_URL not found in .env");
    process.exit(1);
  }

  console.log("🚀 Starting retroactive Google Sheets logging...");

  // 1. Find all leads who have a MESSAGE_SENT activity
  const contactedLeads = await prisma.lead.findMany({
    where: {
      activities: {
        some: { type: "MESSAGE_SENT" },
      },
    },
    include: {
      artist: true,
      activities: {
        where: { type: "MESSAGE_SENT" },
        orderBy: { occurredAt: "desc" },
      },
    },
  });

  console.log(`Found ${contactedLeads.length} contacted leads.`);

  let successCount = 0;
  let failCount = 0;

  for (const lead of contactedLeads) {
    const lastActivity = lead.activities[0];
    
    // Map to 13-column structure
    const values = [
      lead.artist.name,                      // 1. Artist Contacted
      "",                                    // 2. Contact Name
      "",                                    // 3. Phone
      lead.artist.instagramProfileUrl || "", // 4. Social Media
      lead.artist.emails?.[0] || "",         // 5. Email
      lead.artist.officialSiteUrl || "",     // 6. Website
      "",                                    // 7. Responded
      "",                                    // 8. Booked
      "",                                    // 9. Recorded
      "",                                    // 10. Client
      "",                                    // 11. Money Made
      lastActivity.note || "Message sent",   // 12. Notes
      lastActivity.occurredAt.toISOString(), // 13. Date Contacted
    ];

    try {
      const response = await fetch(`${WEBHOOK_URL}?action=appendRow`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          values: JSON.stringify(values),
        }),
      });

      if (response.ok) {
        successCount++;
        console.log(`✅ Logged: ${lead.artist.name}`);
      } else {
        const text = await response.text();
        console.error(`❌ Failed to log ${lead.artist.name}: ${response.status} - ${text}`);
        failCount++;
      }
    } catch (error) {
      console.error(`💥 Error logging ${lead.artist.name}:`, error);
      failCount++;
    }
  }

  console.log(`\n✨ Finished. Logged ${successCount} leads. Failed ${failCount}.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
