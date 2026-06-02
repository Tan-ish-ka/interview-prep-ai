import type { Insights } from "../types/report";

/** Client-side readiness score (0–100) from existing insights only. */
export function computeInsightScore(insights: Insights): number {
  let score = 42;

  if (insights.current_rating !== null) {
    score += Math.min(25, Math.floor(insights.current_rating / 80));
  }

  if (insights.rating_trend === "improving") score += 12;
  if (insights.rating_trend === "declining") score -= 10;

  score += Math.min(15, insights.recent_activity);
  score += Math.min(10, insights.contest_stats.contests_last_30_days * 3);
  score += Math.min(12, Math.floor(insights.activity_stats.average_problems_per_week * 2));
  score += Math.min(8, insights.strong_topics.length * 2);
  score -= Math.min(12, insights.weak_topics.length * 2);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function insightLabel(score: number): string {
  if (score >= 80) return "Interview ready";
  if (score >= 60) return "Strong momentum";
  if (score >= 40) return "Building foundation";
  return "Needs focus";
}
