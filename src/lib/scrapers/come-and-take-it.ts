import { MVP_VENUES } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeComeAndTakeIt = (now?: Date) => scrapeDo512Venue(MVP_VENUES[0], now);
