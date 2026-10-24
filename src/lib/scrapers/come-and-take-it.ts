import { getVenue } from "./config";
import { scrapeDo512Venue } from "./shared";

export const scrapeComeAndTakeIt = (now?: Date) => scrapeDo512Venue(getVenue("come-and-take-it"), now);
