import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeValhallaTavern = (now?: Date) => scrapeDo512Venue(getVenue("valhalla-tavern"), now);
