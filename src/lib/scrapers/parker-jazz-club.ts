import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeParkerJazzClub = (now?: Date) => scrapeDo512Venue(getVenue("parker-jazz"), now);
