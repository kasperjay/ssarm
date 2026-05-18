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

  return calculateLeadScoreFromData(lead.artist, releaseCount);
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
