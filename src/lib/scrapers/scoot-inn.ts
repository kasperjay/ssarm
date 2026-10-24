import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeScootInn = (now?: Date) => scrapeDo512Venue(getVenue("scoot-inn"), now);
