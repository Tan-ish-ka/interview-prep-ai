import { momentumLabel, skillLabel } from "./insightScore";
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
  const skill = skillLabel(insights.skill_score);
  const momentum = momentumLabel(insights.momentum_score);
  const rating = insights.current_rating ?? "unrated";
  const trend = insights.rating_trend;

  const headline = `${skill} · ${momentum}`;

  const narrativeParts: string[] = [
    `@${profile.username} on ${profile.platform} carries a ${trend} rating trend`,
    insights.current_rating !== null
      ? `with a current rating of ${rating} (peak ${insights.max_rating ?? rating})`
      : `with ${insights.total_solved} problems logged`,
    insights.recent_rating_delta !== null
      ? `and a ${insights.recent_rating_delta >= 0 ? "+" : ""}${insights.recent_rating_delta} shift in the latest contest`
      : "",
  ].filter(Boolean);

  let activityComment = "";

  if (insights.activity_stats.problems_last_30_days >= 50) {
    activityComment = "showing excellent recent practice consistency";
  } else if (insights.activity_stats.problems_last_30_days >= 20) {
    activityComment = "maintaining a healthy practice rhythm";
  } else if (insights.activity_stats.problems_last_30_days >= 5) {
    activityComment = "with moderate recent activity";
  } else {
    activityComment = "with very limited recent activity";
  }

  const narrative =
    `${narrativeParts.join(", ")}. ` +
    `The profile solved ${insights.activity_stats.problems_last_30_days} problems in the last 30 days and averages ${insights.activity_stats.average_problems_per_week.toFixed(1)} solves per week over the last 90 days, ${activityComment}. ` +
    `${insights.contest_stats.contests_last_30_days} contest${insights.contest_stats.contests_last_30_days === 1 ? "" : "s"} were participated in during the same period.`;

  const highlights: string[] = [];

  if (insights.rating_trend === "improving") {
    highlights.push("📈 Positive rating trend");
  }

  if (insights.rating_trend === "declining") {
    highlights.push("⚠️ Rating trend needs attention");
  }

  if (insights.activity_stats.problems_last_30_days >= 30) {
    highlights.push("🔥 High recent activity");
  }

  if (insights.contest_stats.contests_last_30_days === 0) {
    highlights.push("🎯 No recent contests detected");
  }

  if (insights.strong_topics.length > 0) {
    highlights.push(
      `Strengths: ${insights.strong_topics.slice(0, 3).join(", ")}`
    );
  }

  if (insights.weak_topics.length > 0) {
    highlights.push(
      `Gaps to close: ${insights.weak_topics.slice(0, 3).join(", ")}`
    );
  }

  if (recommendationCount > 0) {
    highlights.push(
      `${recommendationCount} tailored action${
        recommendationCount === 1 ? "" : "s"
      } queued below`
    );
  } else {
    highlights.push(
      "Metrics look balanced — maintain your current rhythm"
    );
  }

  return { headline, narrative, highlights };
}