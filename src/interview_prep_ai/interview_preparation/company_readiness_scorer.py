"""Score company-specific interview readiness from insights and topic coverage."""

from __future__ import annotations

from typing import Any

from interview_prep_ai.interview_preparation.company_focus_areas import (
    build_company_area_profile,
)
from interview_prep_ai.interview_preparation.company_tracks import (
    CompanyTrack,
    get_company_tracks,
)

_READINESS_LEVEL_POINTS: dict[str, float] = {
    "Interview Ready": 10.0,
    "Nearly Ready": 7.0,
    "Developing": 4.0,
    "Early Stage": 1.0,
}

_COMPANY_LEVEL_THRESHOLDS: tuple[tuple[int, str], ...] = (
    (75, "Ready"),
    (60, "Nearly Ready"),
    (40, "Developing"),
    (0, "Early Stage"),
)

_TOPIC_SHORT_NAMES: dict[str, str] = {
    "Arrays / Strings": "Arrays",
    "Dynamic Programming": "DP",
    "Stacks / Queues": "Stacks",
    "Linked Lists": "Linked Lists",
    "Binary Search": "Binary Search",
    "Sliding Window": "Sliding Window",
    "Bit Manipulation": "Bit Manipulation",
}


def score_company_readiness(
    insights: dict[str, Any],
    *,
    interview_readiness_level: str,
    area_profile: dict[str, dict[str, Any]] | None = None,
    tracks: tuple[CompanyTrack, ...] | None = None,
    limit: int | None = None,
) -> list[dict[str, Any]]:
    """Return company readiness rows sorted by score descending."""
    profile = area_profile or build_company_area_profile(insights)
    company_tracks = tracks or get_company_tracks()

    rows: list[dict[str, Any]] = []
    for track in company_tracks:
        score = _company_score(track, profile, insights, interview_readiness_level)
        strengths = _top_weighted_strengths(track, profile)[:3]
        missing = _top_weighted_gaps(track, profile)[:3]
        rows.append(
            {
                "company": track.name,
                "category": track.category,
                "score": score,
                "level": _company_level(score),
                "reason": _company_reason(track, profile, insights, score),
                "strong_topics": [_topic_short_name(topic) for topic in strengths],
                "missing_topics": [_topic_short_name(topic) for topic in missing],
            }
        )

    rows.sort(key=lambda row: (-row["score"], row["company"]))
    if limit is None:
        return rows
    return rows[:limit]


def _topic_short_name(area: str) -> str:
    return _TOPIC_SHORT_NAMES.get(area, area)


def _company_score(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
    insights: dict[str, Any],
    interview_readiness_level: str,
) -> int:
    topic_coverage = _weighted_topic_coverage(track, area_profile)
    skill = float(insights.get("skill_score", 0))
    momentum = float(insights.get("momentum_score", 0))
    recent_activity = float(insights.get("recent_activity", 0))
    readiness_points = _READINESS_LEVEL_POINTS.get(interview_readiness_level, 1.0)

    activity_factor = min(8.0, recent_activity * 0.35)
    weak_penalty = min(12.0, _weighted_gap_penalty(track, area_profile, gap_type="weak"))
    missing_penalty = min(
        10.0,
        _weighted_gap_penalty(track, area_profile, gap_type="needs_practice") * 0.35,
    )

    skill_bonus = 6.0 if skill >= 90 else (3.0 if skill >= 70 else 0.0)

    raw = (
        topic_coverage * 0.40
        + skill * 0.35
        + momentum * 0.08
        + readiness_points * 2.0
        + activity_factor
        + skill_bonus
        - weak_penalty
        - missing_penalty
    )
    return _clamp(raw)


def _weighted_topic_coverage(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
) -> float:
    total_weight = 0.0
    weighted_sum = 0.0

    for area, weight in track.weights.items():
        area_data = area_profile.get(area, {"status": "needs_practice", "solved_count": 0})
        area_score = _area_score(area_data["status"], area_data["solved_count"])
        total_weight += weight
        weighted_sum += weight * area_score

    if total_weight == 0:
        return 0.0
    return weighted_sum / total_weight


def _area_score(status: str, solved_count: int) -> float:
    if status == "strong":
        return min(100.0, 82.0 + solved_count * 1.5)
    if status == "neutral":
        return min(78.0, 48.0 + solved_count * 4.0)
    if status == "weak":
        return min(45.0, 18.0 + solved_count * 3.0)
    return min(15.0, 5.0 + solved_count * 2.0)


def _weighted_gap_penalty(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
    *,
    gap_type: str,
) -> float:
    penalty = 0.0
    for area, weight in track.weights.items():
        area_data = area_profile.get(area, {"status": "needs_practice"})
        if area_data["status"] == gap_type:
            penalty += weight * (8.0 if gap_type == "weak" else 4.0)
    return penalty


def _company_level(score: int) -> str:
    for threshold, level in _COMPANY_LEVEL_THRESHOLDS:
        if score >= threshold:
            return level
    return "Early Stage"


def _company_reason(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
    insights: dict[str, Any],
    score: int,
) -> str:
    gaps = _top_weighted_gaps(track, area_profile)
    strengths = _top_weighted_strengths(track, area_profile)
    momentum = insights.get("momentum_score", 0)
    recent_activity = insights.get("recent_activity", 0)

    if score >= 75 and strengths:
        return f"Strong fit in {', '.join(strengths[:2])} with solid overall coverage."
    if gaps and momentum < 45:
        return (
            f"Priority gaps in {', '.join(gaps[:2])}; "
            "raise weekly practice to improve company fit."
        )
    if gaps:
        return f"Focus next on {', '.join(gaps[:2])} for this company's interview track."
    if recent_activity < 8:
        return "Topic coverage is decent, but recent solving volume is low."
    if strengths:
        return f"Balanced profile with strengths in {', '.join(strengths[:2])}."
    return "Build foundational coverage across core DSA interview topics."


def _top_weighted_gaps(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
) -> list[str]:
    ranked: list[tuple[float, str]] = []
    for area, weight in track.weights.items():
        status = area_profile.get(area, {}).get("status", "needs_practice")
        if status in {"weak", "needs_practice"}:
            ranked.append((weight, area))
    ranked.sort(key=lambda item: (-item[0], item[1]))
    return [area for _, area in ranked]


def _top_weighted_strengths(
    track: CompanyTrack,
    area_profile: dict[str, dict[str, Any]],
) -> list[str]:
    ranked: list[tuple[float, str]] = []
    for area, weight in track.weights.items():
        status = area_profile.get(area, {}).get("status", "needs_practice")
        if status == "strong":
            ranked.append((weight, area))
    ranked.sort(key=lambda item: (-item[0], item[1]))
    return [area for _, area in ranked]


def _clamp(score: float) -> int:
    return max(0, min(100, round(score)))
