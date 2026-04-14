/**
 * Test for bunk event detection logic from src/lib/utils.ts
 */

const isBunkEvent = (name, description = "") => {
  if (!name) return true;
  
  const bunkKeywords = [
    "DJ Set", "Dance Party", "Kids Party", "Hosted by", "Quizzo", "Trivia", 
    "Happy Hour", "Yoga", "Sports", "Closing Early", "Open Mic", "Karaoke", 
    "Bingo", "Drag Brunch", "Market", "Pop-up", "Ceremony", "Auction", 
    "Workshop", "Comedy Night", "Any Baby Can", "Austin Diaper Bank", 
    "Mad Men", "Kickoff Show", "Anniversary", "Album Release", "NCAA", 
    "NFL", "NBA", "MLB", "Tribute", "Experience", "Cover Band", 
    "Performing the music of", "Emo Night", "Dad Rock Night", 
    "Theme Night", "Come and Take It", "Round Rock"
  ];

  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  if (bunkKeywords.some(kw => lowerName.includes(kw.toLowerCase()))) {
    return true;
  }

  const genericExact = ["dance", "sports", "the dead", "the club"];
  if (genericExact.includes(lowerName)) {
    return true;
  }

  if (/\b\w+\s+Night\b/i.test(lowerName) && !lowerName.includes("vocalist")) {
    return true;
  }

  if (/^(?:\d{1,2}:\d{2}\s*(?:pm|am)?|live|tba|tbd)$/i.test(lowerName)) {
    return true;
  }

  return false;
};

const samples = [
  { name: "The Strokes", expected: false },
  { name: "Radiohead Tribute", expected: true },
  { name: "Pink Floyd Experience", expected: true },
  { name: "80s Cover Band", expected: true },
  { name: "Emo Night Austin", expected: true },
  { name: "Dad Rock Night", expected: true },
  { name: "Jazz Night", expected: true },
  { name: "Come and Take It Live", expected: true },
  { name: "Round Rock Music Fest", expected: true },
  { name: "Performing the music of Prince", expected: true },
  { name: "Metal Show", expected: false },
  { name: "Live at 9:00 PM", expected: true }
];

console.log("Testing bunk event detection logic...");
console.log("--------------------------------------");

let failed = 0;
samples.forEach(({ name, expected }) => {
  const result = isBunkEvent(name);
  const passed = result === expected;
  if (!passed) failed++;
  console.log(`${passed ? "✅" : "❌"} Input: "${name}" | Bunk: ${result} | Expected: ${expected}`);
});

console.log("--------------------------------------");
if (failed === 0) {
  console.log("✨ All bunk tests passed!");
} else {
  console.log(`⚠️  ${failed} tests failed.`);
}
