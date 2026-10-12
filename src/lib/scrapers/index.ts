import { MVP_VENUES } from "./config";
import type { MVPVenueId } from "./config";
import { scrapeAntones } from "./antones";
import { scrapeComeAndTakeIt } from "./come-and-take-it";
import { scrapeContinentalClub } from "./continental-club";
import { scrapeContinentalGallery } from "./continental-gallery";
import { scrapeHotelVegas } from "./hotel-vegas";
import { scrapeMohawk } from "./mohawk";

export { MVP_VENUES } from "./config";
export type { MVPVenueId } from "./config";
export { splitArtistTitle } from "./shared";

const scrapers: Record<MVPVenueId, (now?: Date) => ReturnType<typeof scrapeComeAndTakeIt>> = {
  "come-and-take-it": scrapeComeAndTakeIt,
  "continental-club": scrapeContinentalClub,
  "continental-gallery": scrapeContinentalGallery,
  "hotel-vegas": scrapeHotelVegas,
  antones: scrapeAntones,
  mohawk: scrapeMohawk,
};

export function getVenueScraper(id: MVPVenueId) {
  return scrapers[id];
}

export function isMVPVenueId(value: string): value is MVPVenueId {
  return MVP_VENUES.some((venue) => venue.id === value);
}
