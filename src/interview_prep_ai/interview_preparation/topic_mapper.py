"""Map competitive programming tags to interview-oriented focus areas."""

from __future__ import annotations

from typing import Any

INTERVIEW_FOCUS_AREAS: tuple[str, ...] = (
    "Arrays / Strings",
    "Linked Lists",
    "Stacks / Queues",
    "Binary Search",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Greedy",
    "Math",
    "Bit Manipulation",
)

_CP_TAG_TO_FOCUS: dict[str, str] = {
    "arrays": "Arrays / Strings",
    "strings": "Arrays / Strings",
    "implementation": "Arrays / Strings",
    "two pointers": "Arrays / Strings",
    "sortings": "Arrays / Strings",
    "linked lists": "Linked Lists",
    "data structures": "Stacks / Queues",
    "queues": "Stacks / Queues",
    "deque": "Stacks / Queues",
    "binary search": "Binary Search",
    "trees": "Trees",
    "dfs and similar": "Trees",
    "dsu": "Trees",
    "graphs": "Graphs",
    "shortest paths": "Graphs",
    "flows": "Graphs",
    "graph matchings": "Graphs",
    "schedules": "Graphs",
    "dp": "Dynamic Programming",
    "probabilities": "Dynamic Programming",
    "greedy": "Greedy",
    "constructive algorithms": "Greedy",
    "math": "Math",
    "number theory": "Math",
    "combinatorics": "Math",
    "geometry": "Math",
    "matrices": "Math",
    "bitmasks": "Bit Manipulation",
    "bit manipulation": "Bit Manipulation",
}


def cp_tag_to_focus_area(tag: str) -> str | None:
    """Return the interview focus area for a CP tag, or None if unmapped."""
    return _CP_TAG_TO_FOCUS.get(tag.lower().strip())


def map_interview_focus_areas(insights: dict[str, Any]) -> list[dict[str, Any]]:
    """Build interview focus areas with status from insights tag data."""
    tag_frequency: dict[str, int] = (
    insights.get("tag_frequency")
    or insights.get("top_tags")
    or {}
            )
    weak_topics = set(insights.get("weak_topics") or [])
    strong_topics = set(insights.get("strong_topics") or [])

    area_counts: dict[str, int] = {area: 0 for area in INTERVIEW_FOCUS_AREAS}
    area_weak: dict[str, bool] = {area: False for area in INTERVIEW_FOCUS_AREAS}
    area_strong: dict[str, bool] = {area: False for area in INTERVIEW_FOCUS_AREAS}

    for tag, count in tag_frequency.items():
        focus = cp_tag_to_focus_area(tag)
        if focus is None:
            continue

        area_counts[focus] += count

        if tag in weak_topics:
            area_weak[focus] = True

        if tag in strong_topics:
            area_strong[focus] = True

    focus_areas: list[dict[str, Any]] = []
    for area in INTERVIEW_FOCUS_AREAS:
        solved_count = area_counts[area]
        if area_weak[area]:
            status = "weak"
        elif area_strong[area]:
            status = "strong"
        elif solved_count == 0:
            status = "needs_practice"
        else:
            status = "neutral"

        focus_areas.append(
            {
                "area": area,
                "status": status,
                "solved_count": solved_count,
            }
        )

    return focus_areas
