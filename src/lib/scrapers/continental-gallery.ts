import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeContinentalGallery = (now?: Date) => scrapeDo512Venue(MVP_VENUES[2], now);
