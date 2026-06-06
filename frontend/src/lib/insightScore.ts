import type { Insights } from "../types/report";

export function skillLabel(score: number): string {
  if (score >= 85) return "Elite skill";
  if (score >= 70) return "Advanced";
  if (score >= 50) return "Developing";
  return "Emerging";
}

export function momentumLabel(score: number): string {
  if (score >= 75) return "Hot streak";
  if (score >= 55) return "Steady momentum";
  if (score >= 35) return "Warming up";
  return "Cooling down";
}

/** @deprecated Use insights.skill_score from the API. */
export function computeInsightScore(insights: Insights): number {
  return insights.skill_score;
}

/** @deprecated Use insights.momentum_score from the API. */
export function computeMomentumScore(insights: Insights): number {
  return insights.momentum_score;
}

/** @deprecated Use skillLabel(insights.skill_score). */
export function insightLabel(score: number): string {
  return skillLabel(score);
}
