"""Map competitive programming tags to interview-oriented focus areas."""

from __future__ import annotations

from interview_prep_ai.analytics.topic_normalizer import normalize_topics
from typing import Any

INTERVIEW_FOCUS_AREAS: tuple[str, ...] = (
    "Dynamic Programming",
    "Graphs",
    "Greedy",
    "Binary Search",
    "Math",
    "Bitmasks",
    "Data Structures",
    "Strings",
    "Implementation",
    "Constructive Algorithms",
)

# Mapping from Codeforces/CP tags (normalized) to canonical interview focus areas.
_CP_TAG_TO_FOCUS: dict[str, str] = {
    # Dynamic Programming
    "dp": "Dynamic Programming",
    "dynamic programming": "Dynamic Programming",
    "probabilities": "Dynamic Programming",

    # Graphs
    "graphs": "Graphs",
    "shortest paths": "Graphs",
    "flows": "Graphs",
    "graph matchings": "Graphs",
    "dfs and similar": "Graphs",
    "bfs": "Graphs",
    "dijkstra": "Graphs",
    "topological sort": "Graphs",

    # Greedy and constructive
    "greedy": "Greedy",
    "constructive algorithms": "Constructive Algorithms",
    "brute force": "Constructive Algorithms",

    # Binary search
    "binary search": "Binary Search",
    "ternary search": "Binary Search",

    # Math
    "math": "Math",
    "number theory": "Math",
    "combinatorics": "Math",
    "geometry": "Math",
    "matrices": "Math",

    # Bitmasks
    "bitmasks": "Bitmasks",
    "bit manipulation": "Bitmasks",

    # Data structures (generic)
    "data structures": "Data Structures",
    "stl": "Data Structures",
    "sets": "Data Structures",
    "maps": "Data Structures",
    "hashing": "Data Structures",
    "hash table": "Data Structures",
    "heap": "Data Structures",
    "heaps": "Data Structures",
    "priority queue": "Data Structures",

    # Strings and implementation
    "strings": "Strings",
    "string": "Strings",
    "kmp": "Strings",
    "z-function": "Strings",
    "suffix array": "Strings",
    "implementation": "Implementation",
    "interactive": "Implementation",
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
    weak_topics = set(normalize_topics(insights.get("weak_topics") or []))
    strong_topics = set(normalize_topics(insights.get("strong_topics") or []))

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
