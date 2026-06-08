"""Efficiency and growth-potential analysis for interview preparation."""

from __future__ import annotations

from typing import Any

_EFFICIENCY_BENCHMARK = 5.5
_CONTEST_ACTIVITY_WEIGHT = 4


def _clamp(score: float) -> int:
    return max(0, min(100, round(score)))


def compute_potential_efficiency(insights: dict[str, Any]) -> dict[str, Any]:
    """Return efficiency score, growth potential, and study guidance."""
    efficiency_score = _efficiency_score(insights)
    efficiency_trend = _efficiency_trend(insights)
    growth_potential, growth_reason = _growth_potential(insights, efficiency_score)
    guidance = _study_guidance(insights, efficiency_score, growth_potential)

    return {
        "efficiency_score": efficiency_score,
        "efficiency_trend": efficiency_trend,
        "efficiency_summary": _efficiency_summary(insights, efficiency_score),
        "growth_potential": growth_potential,
        "growth_reason": growth_reason,
        "guidance": guidance,
    }


def _efficiency_score(insights: dict[str, Any]) -> int:
    current_rating = insights.get("current_rating") or 0
    total_solved = insights.get("total_solved", 0)
    contest_stats = insights.get("contest_stats") or {}
    total_contests = contest_stats.get("total_contests", 0)

    weighted_activity = total_solved + total_contests * _CONTEST_ACTIVITY_WEIGHT
    if weighted_activity == 0:
        return 25

    rating_per_activity = current_rating / weighted_activity
    score = min(72.0, (rating_per_activity / _EFFICIENCY_BENCHMARK) * 50.0)

    recent_delta = insights.get("recent_rating_delta")
    recent_activity = insights.get("recent_activity", 0)
    if recent_delta is not None and recent_delta > 0:
        if recent_activity > 0:
            score += min(12.0, (recent_delta / recent_activity) * 4.0)
        else:
            score += min(8.0, recent_delta / 15.0)

    rating_delta = insights.get("rating_delta")
    if rating_delta is not None and rating_delta > 0:
        score += min(8.0, rating_delta / 25.0)

    trend = insights.get("rating_trend", "stable")
    if trend == "improving":
        score += 6.0
    elif trend == "declining":
        score -= 5.0

    return _clamp(score)


def _efficiency_trend(insights: dict[str, Any]) -> str:
    recent_delta = insights.get("recent_rating_delta")
    if recent_delta is not None:
        if recent_delta > 10:
            return "improving"
        if recent_delta < -10:
            return "declining"
    return insights.get("rating_trend", "stable")


def _growth_potential(
    insights: dict[str, Any],
    efficiency_score: int,
) -> tuple[str, str]:
    momentum = insights.get("momentum_score", 0)
    skill = insights.get("skill_score", 0)
    recent_activity = insights.get("recent_activity", 0)
    activity_stats = insights.get("activity_stats") or {}
    weekly_volume = activity_stats.get("average_problems_per_week", 0.0)
    trend = insights.get("rating_trend", "stable")

    potential_index = (
        efficiency_score * 0.35
        + momentum * 0.30
        + max(0, 70 - skill) * 0.2
        + min(15.0, recent_activity * 0.4)
        + min(10.0, weekly_volume * 1.5)
    )
    if trend == "improving":
        potential_index += 8.0
    elif trend == "declining":
        potential_index -= 6.0

    if momentum < 38 or recent_activity < 8 or weekly_volume < 4:
        return (
            "Needs more consistency",
            "Practice volume is limiting how much your current skill can convert into "
            "interview-ready growth.",
        )
    if potential_index >= 62 and (trend == "improving" or efficiency_score >= 55):
        return (
            "High potential",
            "You are converting activity into progress efficiently and still have room "
            "to compound gains.",
        )
    return (
        "Moderate potential",
        "Your foundation is developing steadily — sharper consistency could unlock "
        "the next jump.",
    )


def _efficiency_summary(insights: dict[str, Any], efficiency_score: int) -> str:
    total_solved = insights.get("total_solved", 0)
    contest_stats = insights.get("contest_stats") or {}
    total_contests = contest_stats.get("total_contests", 0)
    current_rating = insights.get("current_rating")

    if current_rating is None or total_solved == 0:
        return "Solve and compete more to measure how efficiently practice converts into rating growth."

    if efficiency_score >= 70:
        return (
            f"Strong conversion: {current_rating} rating from {total_solved} solves "
            f"and {total_contests} contests."
        )
    if efficiency_score >= 45:
        return (
            f"Balanced conversion: rating growth is keeping pace with "
            f"{total_solved} solves and {total_contests} contests."
        )
    return (
        f"High activity relative to rating — focus on quality review to improve "
        f"returns from {total_solved} solves."
    )


def _study_guidance(
    insights: dict[str, Any],
    efficiency_score: int,
    growth_potential: str,
) -> dict[str, str]:
    weak_topics = insights.get("weak_topics") or []
    strong_topics = insights.get("strong_topics") or []
    recent_activity = insights.get("recent_activity", 0)
    trend = insights.get("rating_trend", "stable")

    why = (
        f"Efficiency reflects rating gained per solve and contest. "
        f"Your score is {efficiency_score}/100 with a {trend} trajectory."
    )

    if growth_potential == "Needs more consistency":
        improve = (
            "Build a steady weekly rhythm — 5+ focused solves and at least one timed "
            "session every week."
        )
    elif weak_topics:
        improve = f"Target weak areas first: {', '.join(weak_topics[:3])}."
    elif recent_activity < 10:
        improve = "Increase recent solve volume before adding harder problem tiers."
    else:
        improve = "Mix 70% revision with 30% new medium-hard problems to raise conversion."

    if strong_topics:
        confidence = f"Lean on strengths while growing: {', '.join(strong_topics[:3])}."
    elif efficiency_score >= 60:
        confidence = "Your practice-to-rating conversion is already a meaningful advantage."
    else:
        confidence = "Track weekly rating delta against solve count to spot what is working."

    return {
        "why_this_score": why,
        "what_to_improve_next": improve,
        "confidence_builders": confidence,
    }
