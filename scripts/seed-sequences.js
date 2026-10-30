#!/usr/bin/env node
/**
 * seed-sequences.js
 *
 * Seeds the default follow-up sequences if none exist.
 * Safe to run multiple times — idempotent by checking isDefault sequences.
 *
 * Usage:
 *   node scripts/seed-sequences.js
 */

const { prisma } = require("../src/lib/agent-runner");

const DEFAULT_SEQUENCES = [
  {
    name: "Standard Outreach Cadence",
    description:
      "3-touch sequence for new artist outreach: initial contact, check-in, and a final follow-up.",
    isDefault: true,
    steps: [
      {
        dayOffset: 0,
        tone: "Initial outreach",
        promptHint:
          "Introduce Spectral Soundworks naturally. Reference a recent release or show. Keep it concise, genuine, and low-pressure. Do not pitch services directly — open a conversation.",
      },
      {
        dayOffset: 4,
        tone: "Friendly check-in",
        promptHint:
          "Brief, light follow-up. Acknowledge they may be busy. Reference the previous message in a casual way. Ask one simple open-ended question. Under 5 sentences.",
      },
      {
        dayOffset: 10,
        tone: "Final attempt",
        promptHint:
          "Low-pressure closing message. Express genuine interest, leave the door open for the future, and invite them to reach out whenever they're ready. Warm but conclusive.",
      },
    ],
  },
  {
    name: "Re-engagement Cadence",
    description:
      "2-touch re-engagement for leads that went cold (PAUSED or stale FOLLOW_UP).",
    isDefault: true,
    steps: [
      {
        dayOffset: 0,
        tone: "Warm reactivation",
        promptHint:
          "Reconnect warmly. Acknowledge time has passed. Reference something current about the artist — new music, a show, or a milestone. Express renewed interest naturally.",
      },
      {
        dayOffset: 7,
        tone: "Last attempt",
        promptHint:
          "One final soft touch. Keep it very short — 2–3 sentences max. Leave a clear door open for them to reach out at their own pace. No pressure, just genuine interest.",
      },
    ],
  },
  {
    name: "Pricing Follow-Up Cadence",
    description:
      "2-step cadence for leads that asked about pricing but haven't responded.",
    isDefault: false,
    steps: [
      {
        dayOffset: 2,
        tone: "Pricing reminder",
        promptHint:
          "Gently follow up on the pricing inquiry. Briefly mention services offered (mixing, mastering, full production). Offer to answer any questions or hop on a quick call.",
      },
      {
        dayOffset: 8,
        tone: "Value-add close",
        promptHint:
          "Share a specific artist result or success story (without naming clients). Reinforce the value proposition. Invite them to start with a small project or single track.",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding follow-up sequences...\n");

  const existing = await prisma.followUpSequence.findMany({
    where: { isDefault: true },
    select: { name: true },
  });

  const existingNames = new Set(existing.map((s) => s.name));

  let created = 0;
  let skipped = 0;

  for (const seq of DEFAULT_SEQUENCES) {
    if (existingNames.has(seq.name)) {
      console.log(`  ⏭  Skipping "${seq.name}" (already exists)`);
      skipped++;
      continue;
    }

    await prisma.followUpSequence.create({ data: seq });
    console.log(
      `  ✓  Created "${seq.name}" (${seq.steps.length} steps, default: ${seq.isDefault})`
    );
    created++;
  }

  console.log(`\n📊 Done. Created: ${created}, Skipped: ${skipped}`);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
