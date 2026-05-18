import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

const EXPORT_DIR = '/home/.z/workspaces/con_AEbB00ElHw0O7fWj/ig_export/inbox';
const MY_NAME = 'Kasper Jaylin Pickett';

async function processConversations() {
  const folders = fs.readdirSync(EXPORT_DIR);
  let processedCount = 0;
  let messageCount = 0;

  console.log(`Found ${folders.length} conversations.`);

  for (const folder of folders) {
    const folderPath = path.join(EXPORT_DIR, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const messageFile = path.join(folderPath, 'message_1.json');
    if (!fs.existsSync(messageFile)) continue;

    try {
      const data = JSON.parse(fs.readFileSync(messageFile, 'utf-8'));
      const handle = folder.split('_')[0];
      
      // Find lead by handle
      const lead = await prisma.lead.findFirst({
        where: {
          artist: {
            instagramHandle: handle
          }
        }
      });

      if (!lead) {
        // console.log(`Skipping ${handle}: Lead not found in CRM.`);
        continue;
      }

      const myMessages = data.messages.filter(m => m.sender_name === MY_NAME);
      
      for (const msg of myMessages) {
        const occurredAt = new Date(msg.timestamp_ms);
        
        // Check for duplicate
        const existing = await prisma.activity.findFirst({
          where: {
            leadId: lead.id,
            occurredAt: occurredAt,
            type: 'MESSAGE_SENT'
          }
        });

        if (existing) continue;

        let note = msg.content;
        if (msg.share) {
          note = `Sent attachment: ${msg.share.link}`;
        }

        await prisma.activity.create({
          data: {
            leadId: lead.id,
            type: 'MESSAGE_SENT',
            note: note,
            occurredAt: occurredAt,
          }
        });
        messageCount++;
      }
      processedCount++;
    } catch (err) {
      console.error(`Error processing ${folder}: ${err.message}`);
    }
  }

  console.log(`Successfully processed ${processedCount} conversations and logged ${messageCount} messages.`);
}

processConversations()
  .catch(err => console.error('Fatal Error:', err))
  .finally(async () => {
    await prisma.$disconnect();
  });
