import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeHotelVegas = (now?: Date) => scrapeDo512Venue(getVenue("hotel-vegas"), now);
