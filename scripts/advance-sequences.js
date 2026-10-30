#!/usr/bin/env node
/**
 * advance-sequences.js
 *
 * Advances enrolled leads through their follow-up sequence steps.
 * For each active LeadSequenceEnrollment, checks whether the current step's
 * dayOffset has elapsed since startedAt. If so, generates a MessageDraft
 * stub (for generate-all-drafts.js to flesh out) and advances the step.
 *
 * Usage:
 *   node scripts/advance-sequences.js
 *   node scripts/advance-sequences.js --dry-run
 */

const { withAgentRun, prisma } = require("../src/lib/agent-runner");

const DRY_RUN = process.argv.includes("--dry-run");

async function advanceSequences() {
  const now = new Date();

  // Load all ACTIVE enrollments with their sequence definition
  const enrollments = await prisma.leadSequenceEnrollment.findMany({
    where: { status: "ACTIVE" },
    include: {
      sequence: true,
      lead: {
        include: {
          artist: { select: { name: true, instagramHandle: true, emails: true } },
        },
      },
    },
  });

  console.log(`📋 Active enrollments: ${enrollments.length}`);

  const results = {
    advanced: 0,
    completed: 0,
    skipped: 0,
    errors: 0,
  };

  for (const enrollment of enrollments) {
    const { lead, sequence } = enrollment;
    const steps = sequence.steps;

    if (!Array.isArray(steps) || steps.length === 0) {
      console.warn(`  ⚠️  Sequence "${sequence.name}" has no steps — skipping`);
      results.skipped++;
      continue;
    }

    const currentStep = enrollment.currentStep;

    if (currentStep >= steps.length) {
      // Already past all steps — mark completed
      if (!DRY_RUN) {
        await prisma.leadSequenceEnrollment.update({
          where: { id: enrollment.id },
          data: { status: "COMPLETED", completedAt: now },
        });
      }
      console.log(
        `  ✓  ${lead.artist.name} — sequence "${sequence.name}" already completed`
      );
      results.completed++;
      continue;
    }

    const step = steps[currentStep];
    const stepDueAt = new Date(
      enrollment.startedAt.getTime() + step.dayOffset * 24 * 60 * 60 * 1000
    );

    if (stepDueAt > now) {
      const daysUntil = Math.ceil((stepDueAt - now) / (24 * 60 * 60 * 1000));
      console.log(
        `  ⏳ ${lead.artist.name} — step ${currentStep + 1}/${steps.length} due in ${daysUntil}d (${step.tone})`
      );
      results.skipped++;
      continue;
    }

    console.log(
      `\n  ▶  ${lead.artist.name} — advancing to step ${currentStep + 1}/${steps.length}: "${step.tone}"`
    );
    console.log(`     Prompt hint: ${step.promptHint}`);

    if (!DRY_RUN) {
      try {
        await prisma.$transaction(async (tx) => {
          // Create a MessageDraft stub. generate-all-drafts.js will
          // later flesh this into a real personalised message.
          await tx.messageDraft.create({
            data: {
              leadId: lead.id,
              tone: step.tone,
              body: `[SEQUENCE DRAFT — ${step.tone.toUpperCase()}]\n\n${step.promptHint}\n\n(Run generate-all-drafts.js to generate the full message.)`,
              source: `sequence:${sequence.name}:step${currentStep}`,
              selected: false,
            },
          });

          const nextStep = currentStep + 1;
          const isLast = nextStep >= steps.length;

          // Advance or complete the enrollment
          await tx.leadSequenceEnrollment.update({
            where: { id: enrollment.id },
            data: {
              currentStep: nextStep,
              status: isLast ? "COMPLETED" : "ACTIVE",
              completedAt: isLast ? now : null,
            },
          });

          // Set the lead's nextActionAt to the next step's due date (if not last)
          if (!isLast) {
            const nextStepDef = steps[nextStep];
            const nextDueAt = new Date(
              enrollment.startedAt.getTime() +
                nextStepDef.dayOffset * 24 * 60 * 60 * 1000
            );
            await tx.lead.update({
              where: { id: lead.id },
              data: { nextActionAt: nextDueAt },
            });
          }

          // Log the activity
          await tx.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: `[SEQUENCE] "${sequence.name}" step ${nextStep}/${steps.length} advanced — tone: ${step.tone}`,
              occurredAt: now,
            },
          });

          if (isLast) {
            await tx.activity.create({
              data: {
                leadId: lead.id,
                type: "NOTE",
                note: `[SEQUENCE] "${sequence.name}" completed all ${steps.length} steps.`,
                occurredAt: now,
              },
            });
          }
        });

        results.advanced++;
        console.log(
          `     ✓ Draft created, enrollment advanced${currentStep + 1 >= steps.length ? " (COMPLETED)" : ""}`
        );
      } catch (err) {
        console.error(`     ✗ Error advancing ${lead.artist.name}:`, err.message);
        results.errors++;
      }
    } else {
      results.advanced++;
    }
  }

  return results;
}

withAgentRun("advance-sequences", DRY_RUN ? "dry-run" : "live", advanceSequences)
  .then((results) => {
    console.log("\n📊 Summary:");
    console.log(`   Advanced:  ${results.advanced}`);
    console.log(`   Completed: ${results.completed}`);
    console.log(`   Skipped:   ${results.skipped}`);
    console.log(`   Errors:    ${results.errors}`);
    if (DRY_RUN) console.log("\n⚠️  DRY RUN — no changes written.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal:", err.message);
    process.exit(1);
  });
