import { calculateLeadScoreFromData } from "./scoring-core";
import { prisma } from "./prisma";

export async function calculateLeadScore(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { artist: true },
  });

  if (!lead) return null;

  const releaseCount = await prisma.release.count({
    where: { artistId: lead.artist.id },
  });

  const analyses = await prisma.trackAnalysis.findMany({
    where: { release: { artistId: lead.artist.id } },
    select: { moods: true, themes: true, rating: true },
  });

  const trackAnalysisStats = analyses.length > 0 ? {
    uniqueMoods: [...new Set(analyses.flatMap(a => a.moods))].length,
    uniqueThemes: [...new Set(analyses.flatMap(a => a.themes))].length,
    maturityRatings: [...new Set(analyses.map(a => a.rating).filter(Boolean))],
    hasAnalysis: true,
  } : undefined;

  return calculateLeadScoreFromData(lead.artist, releaseCount, trackAnalysisStats);
}

export async function scoreLead(leadId: string) {
  const scoreData = await calculateLeadScore(leadId);
  if (!scoreData) return null;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return null;

  const shouldAutoQualify = scoreData.isQualified && lead.status === "NEW";
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: scoreData.totalScore,
      scoreRationale: scoreData.scoreRationale,
      status: shouldAutoQualify ? "QUALIFIED" : lead.status,
    },
  });

  await prisma.activity.create({
    data: {
      leadId,
      type: "NOTE",
      note: `[SCORE-UPDATE] Score: ${scoreData.totalScore}/100. ${scoreData.scoreRationale}${shouldAutoQualify ? " -> Auto-qualified!" : ""}`,
    },
  });

  return updatedLead;
}
