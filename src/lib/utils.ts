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
  const noiseRegex = /\s+(?:Tour|World Tour|US Tour|Live|Live at .*|Spring|Summer|Fall|Winter|20\d{2}|Official|Music Video|Lyric Video|Audio|Visualizer|EP|LP|Album|Full Album|Deluxe|Remastered|feat\..*|ft\..*)\s*$/gi;
  
  let cleaned = name.replace(noiseRegex, "").trim();
  
  // Remove set times (e.g. @11:45 PM, @ 11:45, at 11:45, etc.)
  const timeRegex = /\s*(?:@|at|at:|time:)?\s*\d{1,2}:\d{2}(?:\s*[ap]m)?\b/gi;
  cleaned = cleaned.replace(timeRegex, "").trim();
  
  // Also common patterns like "Artist - Tour Name", "Artist: Tour Name", or "Artist | Event"
  const delimiters = /\s*[:\-|]\s*/;
  if (delimiters.test(cleaned)) {
    const parts = cleaned.split(delimiters);
    // If the second part contains "tour", "live", "show", "concert", or is very long, it's likely noise
    if (parts[1] && (
      parts[1].toLowerCase().includes("tour") || 
      parts[1].toLowerCase().includes("live") || 
      parts[1].toLowerCase().includes("show") ||
      parts[1].toLowerCase().includes("concert") ||
      parts[1].length > 15
    )) {
      cleaned = parts[0].trim();
    }
  }

  // Final trim and cleanup
  return cleaned.replace(/\s+/g, " ").trim();
};

