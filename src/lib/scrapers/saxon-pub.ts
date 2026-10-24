import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeSaxonPub = (now?: Date) => scrapeDo512Venue(getVenue("saxon-pub"), now);
