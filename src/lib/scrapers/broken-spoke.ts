import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeBrokenSpoke = (now?: Date) => scrapeDo512Venue(getVenue("broken-spoke"), now);
