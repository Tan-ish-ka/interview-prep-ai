"""Rule-based study recommendations from profile insights."""

from __future__ import annotations

from typing import Any, TypedDict


class Insights(TypedDict):
    rating_delta: int | None
    recent_activity: int
    top_tags: dict[str, int]
    total_solved: int


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

        rating_delta = insights["rating_delta"]
        if rating_delta is not None and rating_delta < 0:
            recommendations.append(
                "Your rating has dipped recently — revisit core concepts and redo fundamental problems."
            )

        if len(insights["top_tags"]) < 3:
            recommendations.append(
                "Broaden your topic coverage — practice across more problem categories."
            )

        return recommendations
