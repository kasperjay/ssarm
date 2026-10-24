const test = require("node:test");
const assert = require("node:assert");
const {
  parseLocationString,
  extractLocationFromText,
  isAustinVenue,
} = require("./location-parser");
const { getProximityTier, calculateLeadScoreFromData } = require("./scoring-core");

test("Location Parser - Explicit State Prevents Austin False Positives", () => {
  // Cities with matching Austin-area names in other states must NOT be tagged as Austin
  const sanMarcosCa = parseLocationString("San Marcos, CA");
  assert.strictEqual(sanMarcosCa.city, "San Marcos");
  assert.strictEqual(sanMarcosCa.state, "CA");
  assert.strictEqual(sanMarcosCa.isAustinArea, false);
  assert.strictEqual(sanMarcosCa.isTexas, false);

  const georgetownDc = parseLocationString("Georgetown, DC");
  assert.strictEqual(georgetownDc.city, "Georgetown");
  assert.strictEqual(georgetownDc.state, "DC");
  assert.strictEqual(georgetownDc.isAustinArea, false);

  const elginIl = parseLocationString("Elgin, IL");
  assert.strictEqual(elginIl.city, "Elgin");
  assert.strictEqual(elginIl.state, "IL");
  assert.strictEqual(elginIl.isAustinArea, false);

  // Texas cities in Austin area MUST be tagged as Austin
  const sanMarcosTx = parseLocationString("San Marcos, TX");
  assert.strictEqual(sanMarcosTx.city, "San Marcos");
  assert.strictEqual(sanMarcosTx.state, "TX");
  assert.strictEqual(sanMarcosTx.isAustinArea, true);
  assert.strictEqual(sanMarcosTx.isTexas, true);

  const austinTx = parseLocationString("Austin, TX");
  assert.strictEqual(austinTx.city, "Austin");
  assert.strictEqual(austinTx.state, "TX");
  assert.strictEqual(austinTx.isAustinArea, true);
  assert.strictEqual(austinTx.isTexas, true);
});

test("Location Parser - International Locations", () => {
  const londonUk = parseLocationString("London, UK");
  assert.strictEqual(londonUk.city, "London");
  assert.strictEqual(londonUk.country, "UK");
  assert.strictEqual(londonUk.isAustinArea, false);
  assert.strictEqual(londonUk.isTexas, false);

  const torontoCa = parseLocationString("Toronto, Canada");
  assert.strictEqual(torontoCa.city, "Toronto");
  assert.strictEqual(torontoCa.country, "Canada");
  assert.strictEqual(torontoCa.isAustinArea, false);
});

test("Location Parser - Extract From Bio (Real Out-of-Town Artists)", () => {
  // Adelitas Way: Las Vegas, NV (even with Austin venue tag)
  const adelitas = extractLocationFromText(
    "Adelitas Way is an American hard rock band formed in Las Vegas, Nevada in 2006. Next show at @comeandtakeitlive"
  );
  assert.strictEqual(adelitas.city, "Las Vegas");
  assert.strictEqual(adelitas.state, "NV");
  assert.strictEqual(adelitas.isAustinArea, false);

  // Dos Santos: Chicago, IL (even with Hotel Vegas mention)
  const dosSantos = extractLocationFromText("Dos Santos is a Chicago-based band playing at Hotel Vegas");
  assert.strictEqual(dosSantos.city, "Chicago");
  assert.strictEqual(dosSantos.state, "IL");
  assert.strictEqual(dosSantos.isAustinArea, false);

  // Low Cut Connie: Philadelphia, PA
  const lowCutConnie = extractLocationFromText(
    "Low Cut Connie is an American rock and roll band based in Philadelphia, Pennsylvania."
  );
  assert.strictEqual(lowCutConnie.city, "Philadelphia");
  assert.strictEqual(lowCutConnie.state, "PA");
  assert.strictEqual(lowCutConnie.isAustinArea, false);

  // Fat Produce: Miami, FL (even with Mohawk mention)
  const fatProduce = extractLocationFromText(
    "indie rock band from Miami, Florida. Live in Austin at Mohawk"
  );
  assert.strictEqual(fatProduce.city, "Miami");
  assert.strictEqual(fatProduce.state, "FL");
  assert.strictEqual(fatProduce.isAustinArea, false);

  // The Heavy Heavy: London, UK
  const heavyHeavy = extractLocationFromText(
    "The Heavy Heavy are a British rock band from London / Brighton, UK."
  );
  assert.strictEqual(heavyHeavy.city, "London");
  assert.strictEqual(heavyHeavy.country, "UK");
  assert.strictEqual(heavyHeavy.isAustinArea, false);

  // Pons: Brooklyn, NY
  const pons = extractLocationFromText("Pons is a violent dance-punk band from Brooklyn, NY.");
  assert.strictEqual(pons.city, "Brooklyn");
  assert.strictEqual(pons.state, "NY");
  assert.strictEqual(pons.isAustinArea, false);

  // Jervis Campbell: Nashville, TN
  const jervis = extractLocationFromText(
    "based in Nashville, Jervis Campbell is an alternative Christian musician"
  );
  assert.strictEqual(jervis.city, "Nashville");
  assert.strictEqual(jervis.state, "TN");
  assert.strictEqual(jervis.isAustinArea, false);

  // We.Automatic: Kansas City, MO
  const weAuto = extractLocationFromText("We.Automatic - alt-rock from Kansas City, MO.");
  assert.strictEqual(weAuto.city, "Kansas City");
  assert.strictEqual(weAuto.state, "MO");
  assert.strictEqual(weAuto.isAustinArea, false);

  // True Austin Local
  const austinBand = extractLocationFromText("Austin-based indie trio making loud noises #atxmusic");
  assert.strictEqual(austinBand.city, "Austin");
  assert.strictEqual(austinBand.state, "TX");
  assert.strictEqual(austinBand.isAustinArea, true);

  // SXSW mention alone does NOT make a band Austin-local
  const sxswOnly = extractLocationFromText("Catch our showcase at SXSW 2024! Stream our new single now.");
  assert.strictEqual(sxswOnly, null);
});

test("Scoring - Proximity Tiers with Venue Ties", () => {
  // Out of state artist with Austin venue tie -> TOURING (15pts)
  const tierTouring = getProximityTier({
    name: "Adelitas Way",
    city: "Las Vegas",
    state: "NV",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(tierTouring.tier, "TOURING");
  assert.strictEqual(tierTouring.proximityScore, 15);

  const touringLead = calculateLeadScoreFromData({
    name: "Adelitas Way",
    city: "Las Vegas",
    state: "NV",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(touringLead.components.proximityScore, 15);
  assert.match(touringLead.scoreRationale, /Touring show in Austin/);

  // Unknown home location with Austin venue tie -> TOURING (15pts), NEVER Austin (35pts)
  const tierUnknownTouring = getProximityTier({
    name: "Unknown Touring Band",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(tierUnknownTouring.tier, "TOURING");
  assert.strictEqual(tierUnknownTouring.proximityScore, 15);

  const unknownTouring = calculateLeadScoreFromData({
    name: "Unknown Touring Band",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(unknownTouring.components.proximityScore, 15);
  assert.match(unknownTouring.scoreRationale, /Touring show in Austin/);

  // Texas non-Austin artist with Austin venue tie -> TEXAS (25pts)
  const tierTexas = getProximityTier({
    name: "Dallas Band",
    city: "Dallas",
    state: "TX",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(tierTexas.tier, "TEXAS");
  assert.strictEqual(tierTexas.proximityScore, 25);

  const texasTouring = calculateLeadScoreFromData({
    name: "Dallas Band",
    city: "Dallas",
    state: "TX",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(texasTouring.components.proximityScore, 25);

  // Austin local artist -> AUSTIN (35pts)
  const tierAustin = getProximityTier({
    name: "Local ATX Band",
    city: "Austin",
    state: "TX",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(tierAustin.tier, "AUSTIN");
  assert.strictEqual(tierAustin.proximityScore, 35);

  const localAustin = calculateLeadScoreFromData({
    name: "Local ATX Band",
    city: "Austin",
    state: "TX",
    hasAustinVenueTie: true,
  });
  assert.strictEqual(localAustin.components.proximityScore, 35);
});
