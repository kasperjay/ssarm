import { addDays } from 'date-fns';

interface ScrapeResult {
  artist: string;
  venue: string;
  eventDate: Date;
  timestamp: string;
  description?: string;
}

async function scrapeContinentalClub() {
  const now = new Date();
  const thirtyDaysFromNow = addDays(now, 30);
  
  try {
    // Continental Club uses Timely API
    const response = await fetch('https://timelyapp.time.ly/api/calendars/54714987/events', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(30000)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Continental Club: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const results: ScrapeResult[] = [];
    
    // Timely API typically returns events with start date and title
    if (data.events && Array.isArray(data.events)) {
      data.events.forEach((event: any) => {
        // Event title often contains artist name
        const title = event.title || event.name || '';
        const startDateStr = event.start_date || event.startDate || event.date || '';
        
        if (title && startDateStr) {
          const eventDate = new Date(startDateStr);
          
          if (eventDate >= now && eventDate <= thirtyDaysFromNow) {
            results.push({
              artist: title,
              venue: 'Continental Club',
              eventDate,
              timestamp: new Date().toISOString(),
              description: event.description || ''
            });
          }
        }
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error scraping Continental Club:', error);
    return [];
  }
}

export { scrapeContinentalClub };