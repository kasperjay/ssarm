import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeMohawk = (now?: Date) => scrapeDo512Venue(getVenue("mohawk"), now);
