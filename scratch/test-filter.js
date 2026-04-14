const { isBunkEvent } = require('../src/lib/utils');

const samples = [
  "DJ Set from Ramesh",
  "Up All Night!: A Dance Party for Any Baby Can and Austin Diaper Bank",
  "GOLDEN: A K Pop Kids Party",
  "Hosted by Anne Troxell",
  "HBO QUIZZO: Mad Men",
  "Austin Psych Fest Kickoff Show",
  "Dance",
  "the Dead",
  "Sports",
  "Oakwood Album Release",
  "Vundabar 'GAWK' 10 Year Anniversary",
  "The Strokes", // should be false
  "Radiohead", // should be false
  "Happy Hour at Mohawk",
  "NCAA Football",
];

console.log("Testing filter logic...");
samples.forEach(s => {
  const result = isBunkEvent(s);
  console.log(`${result ? '❌ BUNK' : '✅ GOOD'}: ${s}`);
});
