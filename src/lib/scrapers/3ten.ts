import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrape3Ten = (now?: Date) => scrapeDo512Venue(getVenue("3ten"), now);
