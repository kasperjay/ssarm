import { Novu } from '@novu/node';

let novuInstance: Novu | null = null;

function getNovu() {
  if (novuInstance) return novuInstance;
  
  const apiKey = process.env.NOVU_API_KEY;
  if (!apiKey) {
    console.warn('NOVU_API_KEY is not set. Novu notifications will be disabled.');
    return null;
  }
  
  novuInstance = new Novu(apiKey);
  return novuInstance;
}

export async function triggerReplyNotification(artistName: string, source: 'Instagram' | 'Email') {
  const novu = getNovu();
  if (!novu) return;

  try {
    await novu.trigger('artist-replied', {
      subscriberId: process.env.NOVU_USER_SUBSCRIBER_ID || '69f9702caca4539eeab8f6bc',
      payload: {
        artistName,
        source,
      },
    });
    console.log(`Novu notification triggered for ${artistName} via ${source}`);
  } catch (error) {
    console.error('Error triggering Novu notification:', error);
  }
}
