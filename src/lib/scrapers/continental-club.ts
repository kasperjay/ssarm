import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeContinentalClub = (now?: Date) => scrapeDo512Venue(MVP_VENUES[1], now);
