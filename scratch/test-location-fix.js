/**
 * Standalone test for location validation logic from src/lib/location.ts
 */

const clean = (s) =>
  s
    .trim()
    .replace(/[.,|•–\-]+$/, "")
    .trim();

const validLocation = (s) => {
  if (!s) return null;
  const c = clean(s);
  if (c.length < 2 || c.length > 80) return null;

  // Reject overly generic or metaphorical values
  const blacklist = [
    "worldwide", "global", "internet", "earth", "world", "everywhere", 
    "universe", "planet", "galaxy", "metaverse", "digital",
    "concert hall", "halls of", "big stage", "small screen", "the road",
    "studio", "bedroom", "basement", "garage", "dream", "nowhere",
    "mohawk" // Added Mohawk to blacklist
  ];

  const lower = c.toLowerCase();
  
  // Check blacklist
  if (blacklist.some(word => lower.includes(word))) return null;

  // Most real locations are short (City) or structured (City, State)
  // If it's more than 4 words and has no comma or digits, it's likely a sentence fragment
  const words = c.split(/\s+/);
  if (words.length > 4 && !c.includes(",") && !/\d/.test(c)) return null;

  // REJECT patterns like "Venue - Stage" if they don't have a comma (city index)
  if (c.includes(" - ") && !c.includes(",")) return null;

  return c;
};

const samples = [
  { name: "Austin, TX", expected: "Austin, TX" },
  { name: "Brooklyn", expected: "Brooklyn" },
  { name: "Mohawk - Outside", expected: null },
  { name: "Mohawk", expected: null },
  { name: "Come and Take It", expected: null },
  { name: "Stubb's - Indoor", expected: null },
  { name: "Worldwide", expected: null },
  { name: "Studio", expected: null },
  { name: "Round Rock", expected: "Round Rock" }, // Valid as a location (city)
  { name: "Austin, TX - Mohawk", expected: "Austin, TX - Mohawk" }, 
  { name: "San Francisco, CA", expected: "San Francisco, CA" }
];

console.log("Testing location validation logic...");
console.log("------------------------------------");

let failed = 0;
samples.forEach(({ name, expected }) => {
  const result = validLocation(name);
  const passed = result === expected;
  if (!passed) failed++;
  console.log(`${passed ? "✅" : "❌"} Input: "${name}" | Result: "${result}" | Expected: "${expected}"`);
});

console.log("------------------------------------");
if (failed === 0) {
  console.log("✨ All tests passed!");
} else {
  console.log(`⚠️  ${failed} tests failed.`);
}
