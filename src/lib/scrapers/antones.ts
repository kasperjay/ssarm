import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeAntones = (now?: Date) => scrapeDo512Venue(MVP_VENUES[4], now);
