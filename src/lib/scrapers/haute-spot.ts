import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeHauteSpot = (now?: Date) => scrapeDo512Venue(getVenue("haute-spot"), now);
