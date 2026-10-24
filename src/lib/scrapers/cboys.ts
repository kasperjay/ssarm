import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeCboys = (now?: Date) => scrapeDo512Venue(getVenue("cboys"), now);
