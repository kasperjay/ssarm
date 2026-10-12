import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeMohawk = (now?: Date) => scrapeDo512Venue(MVP_VENUES[5], now);
