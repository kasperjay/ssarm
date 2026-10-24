import { getVenue } from "./config";
import { scrapeTheCutVenue } from "./shared";

export const scrapeTheCut = (now?: Date) => scrapeTheCutVenue(getVenue("the-cut"), now);
