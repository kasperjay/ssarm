// @ts-nocheck
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { prisma } from '../lib/prisma';

const IMAP_CONFIG = {
  host: process.env.SMTP_HOST || 'mail.spacemail.com',
  port: 993,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

const APP_URL = process.env.APP_URL || 'https://kkkkrash.zo.space';

async function checkEmailReplies() {
  const client = new ImapFlow({
    host: IMAP_CONFIG.host,
    port: IMAP_CONFIG.port,
    secure: IMAP_CONFIG.secure,
    auth: IMAP_CONFIG.auth,
    logger: false,
  });

  try {
    await client.connect();
    
    // Select the inbox
    let lock = await client.getMailboxLock('INBOX');
    try {
      // Search for UNSEEN messages
      for await (let message of client.listMessages('UNSEEN', { structure: false })) {
        const { uid } = message;
        const rawSource = await client.fetchOne(uid, { source: true });
        const parsed = await simpleParser(rawSource.source);
        
        const from = parsed.from?.value[0]?.address;
        const subject = parsed.subject || '';
        const text = parsed.text || '';

        if (from) {
          console.log(`Checking reply from: ${from}`);
          
          // Check if this email belongs to any of our artists
          const artist = await prisma.artist.findFirst({
            where: {
              emails: { has: from },
            },
          });

          if (artist) {
            console.log(`Match found! Artist: ${artist.name}`);
            
            // Hit the webhook
            await fetch(`${APP_URL}/api/webhooks/reply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: from,
                source: 'Email',
                message: text.slice(0, 500), // send a snippet
              }),
            });
            
            // Mark as read so we don't process it again
            await client.messageFlagsAdd(uid, ['\\Seen']);
          }
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (error) {
    console.error('Email Polling Error:', error);
  }
}

// Run every 5 minutes
setInterval(checkEmailReplies, 5 * 60 * 1000);
console.log('Email Reply Poller started. Checking every 5 minutes...');
checkEmailReplies();
