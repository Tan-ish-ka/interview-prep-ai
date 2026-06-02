"""Rule-based study recommendations from profile insights."""

from __future__ import annotations

from typing import Any, TypedDict


class ContestStats(TypedDict):
    total_contests: int
    contests_last_30_days: int
    average_rating_change: float | None


class ActivityStats(TypedDict):
    problems_last_30_days: int
    problems_last_90_days: int
    average_problems_per_week: float


class Insights(TypedDict):
    rating_delta: int | None
    recent_rating_delta: int | None
    rating_trend: str
    recent_activity: int
    top_tags: dict[str, int]
    total_solved: int
    weak_topics: list[str]
    strong_topics: list[str]
    contest_stats: ContestStats
    activity_stats: ActivityStats


class RecommendationService:
    def generate(self, insights: Insights | dict[str, Any]) -> list[str]:
        recommendations: list[str] = []

        if insights["recent_activity"] < 10:
            recommendations.append(
                "Increase your practice consistency — aim for more regular solving sessions."
            )

        if insights["total_solved"] < 100:
            recommendations.append(
                "Build your base by solving more foundational problems before moving to harder topics."
            )

        recent_rating_delta = insights.get("recent_rating_delta")
        if recent_rating_delta is not None and recent_rating_delta < 0:
            recommendations.append(
                "Your rating has dipped recently — revisit core concepts and redo fundamental problems."
            )

        if len(insights["top_tags"]) < 3:
            recommendations.append(
                "Broaden your topic coverage — practice across more problem categories."
            )

        for topic in insights.get("weak_topics") or []:
            recommendations.append(f"Practice more {topic} problems.")

        for topic in insights.get("strong_topics") or []:
            recommendations.append(f"Leverage your strength in {topic}.")

        recommendations.extend(_smart_recommendations(insights))

        return recommendations


def _smart_recommendations(insights: Insights | dict[str, Any]) -> list[str]:
    """Additional recommendations from contest, activity, and rating-trend insights."""
    recommendations: list[str] = []

    contest_stats = insights.get("contest_stats") or {}
    if contest_stats.get("contests_last_30_days", 0) < 2:
        recommendations.append(
            "Participate in contests more frequently to improve consistency."
        )

    activity_stats = insights.get("activity_stats") or {}
    if activity_stats.get("average_problems_per_week", 0) < 5:
        recommendations.append("Increase your weekly problem-solving volume.")

    if insights.get("rating_trend") == "declining":
        recommendations.append(
            "Review recent contest mistakes before your next competition."
        )

    return recommendations
