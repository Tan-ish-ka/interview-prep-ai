import { insightLabel, computeInsightScore } from "./insightScore";
import type { Insights, Profile } from "../types/report";

export interface AiSummaryResult {
  headline: string;
  narrative: string;
  highlights: string[];
}

export function buildAiSummary(
  profile: Profile,
  insights: Insights,
  recommendationCount: number,
): AiSummaryResult {
  const score = computeInsightScore(insights);
  const label = insightLabel(score);
  const rating = insights.current_rating ?? "unrated";
  const trend = insights.rating_trend;

  const headline = `${label} — ${trend} trajectory`;

  const narrativeParts: string[] = [
    `@${profile.username} on ${profile.platform} carries a ${trend} rating trend`,
    insights.current_rating !== null
      ? `with a current rating of ${rating} (peak ${insights.max_rating ?? rating})`
      : `with ${insights.total_solved} problems logged`,
    insights.recent_rating_delta !== null
      ? `and a ${insights.recent_rating_delta >= 0 ? "+" : ""}${insights.recent_rating_delta} shift in the latest contest`
      : "",
  ].filter(Boolean);

  const narrative = `${narrativeParts.join(", ")}. Practice volume sits at ${insights.activity_stats.problems_last_30_days} solves in 30 days (~${insights.activity_stats.average_problems_per_week.toFixed(1)} per week), with ${insights.contest_stats.contests_last_30_days} contest${insights.contest_stats.contests_last_30_days === 1 ? "" : "s"} in the same window.`;

  const highlights: string[] = [];

  if (insights.strong_topics.length > 0) {
    highlights.push(`Strengths: ${insights.strong_topics.slice(0, 3).join(", ")}`);
  }
  if (insights.weak_topics.length > 0) {
    highlights.push(`Gaps to close: ${insights.weak_topics.slice(0, 3).join(", ")}`);
  }
  if (recommendationCount > 0) {
    highlights.push(`${recommendationCount} tailored action${recommendationCount === 1 ? "" : "s"} queued below`);
  } else {
    highlights.push("Metrics look balanced — maintain your current rhythm");
  }

  return { headline, narrative, highlights };
}
