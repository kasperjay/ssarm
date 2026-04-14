const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const formatRelativeDate = (date: Date | null | undefined) => {
  if (!date) return "Unknown";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) < 7) {
    return formatter.format(diffDays, "day");
  }
  const diffWeeks = Math.round(diffDays / 7);
  if (Math.abs(diffWeeks) < 5) {
    return formatter.format(diffWeeks, "week");
  }
  const diffMonths = Math.round(diffDays / 30);
  return formatter.format(diffMonths, "month");
};

export const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

export const formatLocation = (location: string | null, city: string | null, state: string | null, country: string | null) => {
  if (location) return location;
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
};

export const clampScore = (score: number | null) => {
  if (score === null || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
};

export const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const cleanArtistName = (name: string): string => {
  if (!name) return "";
  
  // Remove common tour/event suffixes (case insensitive)
  const noiseRegex = /\s+(?:Tour|World Tour|US Tour|Live|Live at .*|Spring|Summer|Fall|Winter|20\d{2}|Official|Music Video|Lyric Video|Audio|Visualizer|EP|LP|Album|Full Album|Deluxe|Remastered|feat\..*|ft\..*|with .*|and guests.*|presented by .*)\s*$/gi;
  
  let cleaned = name.replace(noiseRegex, "").trim();
  
  // Remove "Artist presents: ..." or "Heard presents: ..." or "Clockwork Music presents: ..."
  if (/presents:?\s+/i.test(cleaned)) {
    const parts = cleaned.split(/presents:?\s+/i);
    if (parts[1]) {
      cleaned = parts[1].trim();
    }
  }

  // Remove set times (e.g. @11:45 PM, @ 11:45, at 11:45, etc.)
  const timeRegex = /\s*(?:@|at|at:|time:)?\s*\d{1,2}:\d{2}(?:\s*[ap]m)?\b/gi;
  cleaned = cleaned.replace(timeRegex, "").trim();
  
  // Also common patterns like "Artist - Tour Name" or "Artist - Event"
  if (cleaned.includes(" - ")) {
    const parts = cleaned.split(" - ");
    if (parts[1] && (parts[1].toLowerCase().includes("tour") || parts[1].toLowerCase().includes("live") || parts[1].toLowerCase().includes("release"))) {
      cleaned = parts[0].trim();
    }
  }

  // Final trim and cleanup
  return cleaned.replace(/\s+/g, " ").trim();
};

export const isBunkEvent = (name: string, description?: string): boolean => {
  if (!name) return true;
  
  const bunkKeywords = [
    "DJ Set", 
    "Dance Party", 
    "Kids Party", 
    "Hosted by", 
    "Quizzo", 
    "Trivia", 
    "Happy Hour", 
    "Yoga", 
    "Sports", 
    "Closing Early",
    "Open Mic",
    "Karaoke",
    "Bingo",
    "Drag Brunch",
    "Market",
    "Pop-up",
    "Ceremony",
    "Auction",
    "Workshop",
    "Comedy Night",
    "Any Baby Can",
    "Austin Diaper Bank",
    "Mad Men",
    "Kickoff Show",
    "Anniversary",
    "Album Release",
    "NCAA",
    "NFL",
    "NBA",
    "MLB",
    "Tribute",
    "Experience",
    "Cover Band",
    "Performing the music of",
    "Emo Night",
    "Dad Rock Night",
    "Theme Night",
    "Come and Take It",
    "Round Rock",
    "Rave",
    "Showcase",
    "Broadway",
    "Battle of the Bands",
    "Night of",
    "A Night with",
    "Pre-Show",
    "Kickoff Tour"
  ];

  const lowerName = name.toLowerCase();
  const lowerDesc = (description || "").toLowerCase();

  // Check if any bunk keyword is in the name
  if (bunkKeywords.some(kw => lowerName.includes(kw.toLowerCase()))) {
    return true;
  }

  // Exact matches for generic categories
  const genericExact = ["dance", "sports", "the dead", "the club"];
  if (genericExact.includes(lowerName)) {
    return true;
  }

  // If the name ends with " Night" or contains it in a way that suggests a generic event
  if (/\b\w+\s+Night\b/i.test(lowerName) && !lowerName.includes("vocalist")) {
    // some exceptions might be needed here, but generally "[Genre] Night" is bunk
    return true;
  }

  // If the name is basically just a time or "Live", it's bunk
  if (/^(?:\d{1,2}:\d{2}\s*(?:pm|am)?|live|tba|tbd)$/i.test(lowerName)) {
    return true;
  }

  return false;
};

