import { addDays } from 'date-fns';

interface ScrapeResult {
  artist: string;
  venue: string;
  eventDate: Date;
  timestamp: string;
  description?: string;
}

async function scrapeComeAndTakeIt() {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);
  
  try {
    // Scrape comeandtakeitproductions.com for events
    const response = await fetch('https://comeandtakeitproductions.com/live', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Come and Take It: ${response.status} ${response.statusText}`);
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Look for event listings - this will need to be adjusted based on actual HTML structure
    const eventElements = doc.querySelectorAll('.event, .show, .concert, .event-item');
    const results: ScrapeResult[] = [];
    
    eventElements.forEach((element) => {
      const text = element.textContent?.trim() || '';
      
      // Extract artist name - look for patterns
      let artist = '';
      const artistMatch = text.match(/([A-Za-z][A-Za-z\s]+?)(?=\s+(?:at|@|\d{1,2}:|\d{1,2}\s*(?:pm|am|AM|PM))|$)/i);
      if (artistMatch) {
        artist = artistMatch[1].trim();
      }
      
      // Extract date/time
      const dateMatch = text.match(/\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i);
      if (dateMatch && artist) {
        const dateStr = dateMatch[0];
        const eventDate = new Date(dateStr);
        
        // Only include events within next 30 days
        if (eventDate >= now && eventDate <= thirtyDaysFromNow) {
          results.push({
            artist,
            venue: 'Come and Take It',
            eventDate,
            timestamp: new Date().toISOString(),
            description: text
          });
        }
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error scraping Come and Take It:', error);
    return [];
  }
}

export { scrapeComeAndTakeIt };