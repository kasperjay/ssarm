import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeElephantRoom = (now?: Date) => scrapeDo512Venue(getVenue("elephant-room"), now);
