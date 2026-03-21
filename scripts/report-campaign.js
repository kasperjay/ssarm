#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Load .env
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Reporting utilities
function calculateFunnelMetrics(leads) {
  const total = leads.length;
  const qualified = leads.filter((l) => l.status === "QUALIFIED").length;
  const contacted = leads.filter((l) => l.status === "CONTACTED").length;
  const followUp = leads.filter((l) => l.status === "FOLLOW_UP").length;
  const converted = leads.filter((l) => l.status === "CONVERTED").length;
  const lost = leads.filter((l) => l.status === "LOST").length;

  return {
    total,
    qualified,
    contacted,
    followUp,
    converted,
    lost,
    conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0",
    qualificationRate: total > 0 ? ((qualified / total) * 100).toFixed(1) : "0.0",
  };
}

function analyzeTonePerformance(activities) {
  const toneMetrics = {};

  // Extract tone from activity notes
  const tones = ["warm", "check-in", "escalation", "final-attempt"];

  for (const tone of tones) {
    const toneActivities = activities.filter((a) => a.note && a.note.includes(tone));
    toneMetrics[tone] = {
      mentions: toneActivities.length,
      followUpRate: ((toneActivities.length / Math.max(activities.length, 1)) * 100).toFixed(1),
    };
  }

  return toneMetrics;
}

function analyzeChannelPerformance(activities) {
  const channels = {};

  // Detect channel from activity notes
  const channelKeywords = {
    email: ["email", "sent", "message"],
    instagram: ["dm", "instagram", "ig"],
    phone: ["call", "phone"],
    in_person: ["met", "met in person", "show"],
  };

  for (const [channel, keywords] of Object.entries(channelKeywords)) {
    const channelActivities = activities.filter((a) =>
      keywords.some((kw) => a.note?.toLowerCase().includes(kw))
    );
    channels[channel] = channelActivities.length;
  }

  return channels;
}

function identifyHighPerformers(leads) {
  // High performers: score >= 70 and contacted
  return leads.filter((l) => l.score >= 70 && ["CONTACTED", "FOLLOW_UP", "CONVERTED"].includes(l.status));
}

function identifyUnderperformers(leads) {
  // Underperformers: score >= 60 but status is still NEW/EARLY
  return leads.filter((l) => l.score >= 60 && ["NEW", "EARLY"].includes(l.status));
}

function identifyAtRisk(leads) {
  // At-risk: status FOLLOW_UP but no activity in 14 days
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  return leads.filter((l) => l.status === "FOLLOW_UP" && (!l.updatedAt || l.updatedAt < twoWeeksAgo));
}

async function generateCampaignReport(options = {}) {
  const { days = 7, includeDetails = false } = options;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Fetch all leads with activities
  const leads = await prisma.lead.findMany({
    include: {
      artist: true,
      activities: {
        where: {
          occurredAt: { gte: startDate },
        },
      },
    },
  });

  // Calculate funnel metrics
  const funnelMetrics = calculateFunnelMetrics(leads);

  // Analyze all activities for tone/channel
  const allActivities = await prisma.activity.findMany({
    where: {
      occurredAt: { gte: startDate },
    },
  });

  const tonePerformance = analyzeTonePerformance(allActivities);
  const channelPerformance = analyzeChannelPerformance(allActivities);

  // Identify segments
  const highPerformers = identifyHighPerformers(leads);
  const underperformers = identifyUnderperformers(leads);
  const atRisk = identifyAtRisk(leads);

  // Score distribution
  const scoreDistribution = {
    excellent: leads.filter((l) => l.score >= 80).length, // 80-100
    strong: leads.filter((l) => l.score >= 60 && l.score < 80).length, // 60-79
    moderate: leads.filter((l) => l.score >= 40 && l.score < 60).length, // 40-59
    weak: leads.filter((l) => l.score < 40).length, // 0-39
  };

  return {
    generatedAt: new Date(),
    periodDays: days,
    funnel: funnelMetrics,
    tonePerformance,
    channelPerformance,
    scoreDistribution,
    segments: {
      highPerformers: highPerformers.length,
      underperformers: underperformers.length,
      atRisk: atRisk.length,
    },
    details:
      includeDetails &&
      ({
        highPerformersList: highPerformers.slice(0, 5).map((l) => l.artist.name),
        underperformersList: underperformers.slice(0, 5).map((l) => l.artist.name),
        atRiskList: atRisk.slice(0, 5).map((l) => l.artist.name),
      }),
  };
}

function formatReportForConsole(report) {
  const output = [];

  output.push("📊 CAMPAIGN ANALYTICS REPORT");
  output.push(`Generated: ${report.generatedAt.toLocaleString()}`);
  output.push(`Period: Last ${report.periodDays} days`);
  output.push("");

  // Funnel
  output.push("🔄 CONVERSION FUNNEL");
  output.push(`  Total Leads: ${report.funnel.total}`);
  output.push(`  → Qualified: ${report.funnel.qualified} (${report.funnel.qualificationRate}%)`);
  output.push(`  → Contacted: ${report.funnel.contacted}`);
  output.push(`  → Follow-up: ${report.funnel.followUp}`);
  output.push(`  → Converted: ${report.funnel.converted} (${report.funnel.conversionRate}%)`);
  output.push(`  → Lost: ${report.funnel.lost}`);
  output.push("");

  // Score distribution
  output.push("📈 SCORE DISTRIBUTION");
  output.push(`  Excellent (80+): ${report.scoreDistribution.excellent} leads`);
  output.push(`  Strong (60-79): ${report.scoreDistribution.strong} leads`);
  output.push(`  Moderate (40-59): ${report.scoreDistribution.moderate} leads`);
  output.push(`  Weak (0-39): ${report.scoreDistribution.weak} leads`);
  output.push("");

  // Tone performance
  output.push("💬 TONE EFFECTIVENESS");
  for (const [tone, metrics] of Object.entries(report.tonePerformance)) {
    if (metrics.mentions > 0) {
      output.push(`  ${tone}: ${metrics.mentions} mentions (${metrics.followUpRate}% of actions)`);
    }
  }
  output.push("");

  // Channel performance
  output.push("📱 CHANNEL ACTIVITY");
  for (const [channel, count] of Object.entries(report.channelPerformance)) {
    if (count > 0) {
      output.push(`  ${channel}: ${count} activities`);
    }
  }
  output.push("");

  // Segments
  output.push("🎯 SEGMENT ANALYSIS");
  output.push(`  High Performers: ${report.segments.highPerformers} leads`);
  output.push(`  Underperformers: ${report.segments.underperformers} leads`);
  output.push(`  At-Risk: ${report.segments.atRisk} leads`);
  output.push("");

  if (report.details) {
    if (report.details.highPerformersList.length > 0) {
      output.push("Top High Performers:");
      report.details.highPerformersList.forEach((name) => output.push(`  • ${name}`));
      output.push("");
    }

    if (report.details.underperformersList.length > 0) {
      output.push("⚠️  Underperformers (not yet contacted):");
      report.details.underperformersList.forEach((name) => output.push(`  • ${name}`));
      output.push("");
    }

    if (report.details.atRiskList.length > 0) {
      output.push("🚨 At-Risk (14+ days without action):");
      report.details.atRiskList.forEach((name) => output.push(`  • ${name}`));
      output.push("");
    }
  }

  return output.join("\n");
}

async function main() {
  const daysIndex = process.argv.indexOf("--days");
  const days = daysIndex !== -1 ? parseInt(process.argv[daysIndex + 1], 10) : 7;
  const includeDetails = process.argv.includes("--details");

  console.log("📊 Campaign Analytics & Reporting Agent\n");

  const report = await generateCampaignReport({
    days,
    includeDetails,
  });

  const formattedReport = formatReportForConsole(report);
  console.log(formattedReport);

  // Get first lead for logging report
  const firstLead = await prisma.lead.findFirst();
  if (firstLead) {
    await prisma.activity.create({
      data: {
        leadId: firstLead.id,
        type: "NOTE",
        note: `[AUTO-REPORT] Campaign analytics generated for ${days}-day period. Conversion: ${report.funnel.conversionRate}%, High performers: ${report.segments.highPerformers}, At-risk: ${report.segments.atRisk}`,
      },
    });
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
