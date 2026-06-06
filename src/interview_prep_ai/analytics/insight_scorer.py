"""Skill and momentum scores derived from profile insights."""

from __future__ import annotations

from typing import Any


def _clamp(score: float) -> int:
    return max(0, min(100, round(score)))


def compute_skill_score(insights: dict[str, Any]) -> int:
    """Long-term competitive programming strength (0–100)."""
    score = 8.0

    current_rating = insights.get("current_rating")
    if current_rating is not None:
        score += min(40, current_rating // 100)

    max_rating = insights.get("max_rating")
    if max_rating is not None:
        score += min(12, max_rating // 200)

    score += min(28, insights.get("total_solved", 0) // 25)

    contest_stats = insights.get("contest_stats") or {}
    score += min(15, contest_stats.get("total_contests", 0) // 10)

    strong_topics = insights.get("strong_topics") or []
    weak_topics = insights.get("weak_topics") or []
    score += min(5, len(strong_topics) * 2)
    score -= min(5, len(weak_topics) * 2)

    return _clamp(score)


def compute_momentum_score(insights: dict[str, Any]) -> int:
    """Recent activity and short-term trajectory (0–100)."""
    score = 20.0

    score += min(25, insights.get("recent_activity", 0))

    contest_stats = insights.get("contest_stats") or {}
    score += min(18, contest_stats.get("contests_last_30_days", 0) * 6)

    activity_stats = insights.get("activity_stats") or {}
    score += min(18, int(activity_stats.get("average_problems_per_week", 0) * 2.5))

    recent_delta = insights.get("recent_rating_delta")
    if recent_delta is not None:
        score += max(-10, min(10, recent_delta // 15))

    rating_trend = insights.get("rating_trend", "stable")
    if rating_trend == "improving":
        score += 8
    elif rating_trend == "declining":
        score -= 6

    return _clamp(score)
