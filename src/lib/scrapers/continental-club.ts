import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeContinentalClub = (now?: Date) => scrapeDo512Venue(getVenue("continental-club"), now);
