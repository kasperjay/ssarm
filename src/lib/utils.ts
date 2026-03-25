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

