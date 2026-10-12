import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeHotelVegas = (now?: Date) => scrapeDo512Venue(MVP_VENUES[3], now);
