import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeAntones = (now?: Date) => scrapeDo512Venue(getVenue("antones"), now);
