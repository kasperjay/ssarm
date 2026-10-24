import { calculateLeadScoreFromData } from "./scoring-core";
import { isAustinVenue } from "./location-parser";
import { scanLeadForProductionNeeds, isClearPreserved, FRESHNESS_DAYS } from "./production-need-scanner";
import { isNonLocalWithPastGigOnly } from "./show-parser";
import { prisma } from "./prisma";
import type { ProductionNeedLevel } from "local-prisma-client";

export async function calculateLeadScore(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      artist: true,
      activities: { select: { note: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!lead) return null;

  const [releaseCount, analyses, instagramPosts, releases] = await Promise.all([
    prisma.release.count({
      where: { artistId: lead.artist.id },
    }),
    prisma.trackAnalysis.findMany({
      where: { release: { artistId: lead.artist.id } },
      select: { moods: true, themes: true, rating: true },
    }),
    prisma.instagramPost.findMany({
      where: { artistId: lead.artist.id },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      take: 30,
      select: { caption: true },
    }),
    prisma.release.findMany({
      where: { artistId: lead.artist.id },
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: { title: true, releaseDate: true },
    }),
  ]);

  const trackAnalysisStats = analyses.length > 0 ? {
    uniqueMoods: [...new Set(analyses.flatMap(a => a.moods))].length,
    uniqueThemes: [...new Set(analyses.flatMap(a => a.themes))].length,
    maturityRatings: [...new Set(analyses.map(a => a.rating).filter(Boolean))],
    hasAnalysis: true,
  } : undefined;

  const isPastGigOnly = isNonLocalWithPastGigOnly(lead);
  const hasAustinVenueTie = !isPastGigOnly && lead.activities.some((a) => isAustinVenue(a.note));
  const artistWithTie = {
    ...lead.artist,
    hasAustinVenueTie,
  };

  // Check recent activity for operator edits
  const latestActivity = lead.activities[0]?.note || "";
  const isRecentReset = latestActivity.includes("Production need cleared (reset to NONE)");
  const isRecentManual = latestActivity.includes("Production need set to ");

  let needLevel: ProductionNeedLevel = (lead.productionNeedLevel as ProductionNeedLevel) || "NONE";
  let needEvidence: string[] = Array.isArray(lead.productionNeedEvidence)
    ? (lead.productionNeedEvidence as string[])
    : [];
  let needApprovedAt: Date | null = lead.productionNeedApprovedAt;

  if (isRecentReset) {
    needLevel = "NONE";
    needEvidence = [];
    needApprovedAt = null;
  } else if (isRecentManual && needApprovedAt && (Date.now() - new Date(needApprovedAt).getTime()) / 86400000 < FRESHNESS_DAYS) {
    // Keep recently saved manual review if operator explicitly edited
  } else {
    // Fully automated scan (PROBABLE: +12pt, POSSIBLE: +8pt, NONE: 0pt)
    const scanResult = scanLeadForProductionNeeds({
      bio: lead.artist.bio,
      captions: instagramPosts.map((p) => p.caption).filter(Boolean) as string[],
      releases,
    });
    needLevel = scanResult.level as ProductionNeedLevel;
    needEvidence = scanResult.evidence;
    needApprovedAt = scanResult.level !== "NONE" ? new Date() : null;
  }

  const scoreData = calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats, {
    level: needLevel,
    evidence: needEvidence,
    approvedAt: needApprovedAt,
  });

  return {
    ...scoreData,
    productionNeed: {
      level: needLevel,
      evidence: needEvidence,
      approvedAt: needApprovedAt,
    },
  };
}

export async function scoreLead(leadId: string) {
  const scoreData = await calculateLeadScore(leadId);
  if (!scoreData) return null;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      artist: true,
      activities: { select: { note: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!lead) return null;

  const isPastGigOnly = isNonLocalWithPastGigOnly(lead);
  const shouldPause = isPastGigOnly && (lead.status === "NEW" || lead.status === "QUALIFIED");
  const shouldAutoQualify = !isPastGigOnly && scoreData.isQualified && lead.status === "NEW";

  const nextStatus = shouldPause ? "PAUSED" : shouldAutoQualify ? "QUALIFIED" : lead.status;

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: scoreData.totalScore,
      scoreRationale: scoreData.scoreRationale,
      status: nextStatus,
      productionNeedLevel: scoreData.productionNeed.level,
      productionNeedEvidence: scoreData.productionNeed.evidence,
      productionNeedApprovedAt: scoreData.productionNeed.approvedAt,
    },
  });

  if (shouldPause) {
    await prisma.activity.create({
      data: {
        leadId,
        type: "NOTE",
        note: `[AUTO-PAUSE] Non-local artist whose Austin gigs have already been played. Removed from lead queue.`,
      },
    });
  } else {
    await prisma.activity.create({
      data: {
        leadId,
        type: "NOTE",
        note: `[SCORE-UPDATE] Score: ${scoreData.totalScore}/100. ${scoreData.scoreRationale}${shouldAutoQualify ? " -> Auto-qualified!" : ""}`,
      },
    });
  }

  return updatedLead;
}
