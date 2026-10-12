export const MVP_VENUES = [
  {
    id: "come-and-take-it",
    name: "Come and Take It Live",
    calendarUrl: "https://family.do512.com/venues/come-and-take-it-live/month_events",
  },
  {
    id: "continental-club",
    name: "Continental Club",
    calendarUrl: "https://family.do512.com/venues/the-continental-club/month_events",
  },
  {
    id: "continental-gallery",
    name: "Continental Gallery",
    calendarUrl: "https://family.do512.com/venues/the-continental-club-gallery/month_events",
  },
  {
    id: "hotel-vegas",
    name: "Hotel Vegas",
    calendarUrl: "https://family.do512.com/venues/hotel-vegas-the-volstead-lounge/month_events",
  },
  {
    id: "antones",
    name: "Antone's",
    calendarUrl: "https://family.do512.com/venues/antone-s/month_events",
  },
  {
    id: "mohawk",
    name: "Mohawk",
    calendarUrl: "https://family.do512.com/venues/mohawk-austin/month_events",
  },
] as const;

export type MVPVenueId = (typeof MVP_VENUES)[number]["id"];
export type MVPVenue = (typeof MVP_VENUES)[number];
