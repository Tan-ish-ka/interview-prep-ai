"""Interview readiness level — separate from Skill and Momentum scores."""

from __future__ import annotations

from typing import Any

READINESS_LEVELS: tuple[str, ...] = (
    "Interview Ready",
    "Nearly Ready",
    "Developing",
    "Early Stage",
)


def determine_readiness_level(
    insights: dict[str, Any],
    focus_areas: list[dict[str, Any]],
) -> str:
    """
    Derive a categorical readiness level from skill, momentum, and topic coverage.

    Skill and Momentum remain separate scores; this is an independent interview analysis.
    """
    skill = insights.get("skill_score", 0)
    momentum = insights.get("momentum_score", 0)
    total_solved = insights.get("total_solved", 0)
    weak_topics = insights.get("weak_topics") or []
    strong_topics = insights.get("strong_topics") or []

    weak_area_count = sum(1 for area in focus_areas if area["status"] == "weak")
    practiced_areas = sum(1 for area in focus_areas if area["solved_count"] > 0)

    readiness_index = (
        skill * 0.45
        + momentum * 0.20
        + min(15, total_solved // 40)
        + min(10, len(strong_topics) * 3)
        + min(8, practiced_areas)
        - min(12, len(weak_topics) * 2)
        - min(8, weak_area_count * 2)
    )

    if readiness_index >= 72 and skill >= 60:
        return "Interview Ready"
    if readiness_index >= 52 and skill >= 40:
        return "Nearly Ready"
    if readiness_index >= 30 or total_solved >= 60:
        return "Developing"
    return "Early Stage"
