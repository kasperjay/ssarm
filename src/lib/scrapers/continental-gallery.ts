import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeContinentalGallery = (now?: Date) => scrapeDo512Venue(getVenue("continental-gallery"), now);
