"""Interview-company focus dimensions and CP tag mapping."""

from __future__ import annotations

from typing import Any

COMPANY_FOCUS_AREAS: tuple[str, ...] = (
    "Arrays / Strings",
    "Hashing",
    "Binary Search",
    "Stacks / Queues",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Greedy",
    "Bit Manipulation",
    "Backtracking",
    "Heaps",
    "Sliding Window",
    "Intervals",
    "Math",
)

_CP_TAG_TO_COMPANY_FOCUS: dict[str, str] = {
    "arrays": "Arrays / Strings",
    "strings": "Arrays / Strings",
    "implementation": "Arrays / Strings",
    "sortings": "Arrays / Strings",
    "hashing": "Hashing",
    "data structures": "Hashing",
    "binary search": "Binary Search",
    "queues": "Stacks / Queues",
    "deque": "Stacks / Queues",
    "linked lists": "Linked Lists",
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
    "bitmasks": "Bit Manipulation",
    "bit manipulation": "Bit Manipulation",
    "brute force": "Backtracking",
    "backtracking": "Backtracking",
    "two pointers": "Sliding Window",
    "sliding window": "Sliding Window",
    "heaps": "Heaps",
    "priority queue": "Heaps",
    "intervals": "Intervals",
    "math": "Math",
    "number theory": "Math",
    "combinatorics": "Math",
    "geometry": "Math",
    "matrices": "Math",
}


def cp_tag_to_company_focus(tag: str) -> str | None:
    return _CP_TAG_TO_COMPANY_FOCUS.get(tag.lower().strip())


def build_company_area_profile(insights: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Return per-dimension status and solved counts for company scoring."""
    tag_frequency: dict[str, int] = (
    insights.get("tag_frequency")
    or insights.get("top_tags")
    or {}
       )
    weak_topics = set(insights.get("weak_topics") or [])
    strong_topics = set(insights.get("strong_topics") or [])

    counts: dict[str, int] = {area: 0 for area in COMPANY_FOCUS_AREAS}
    is_weak: dict[str, bool] = {area: False for area in COMPANY_FOCUS_AREAS}
    is_strong: dict[str, bool] = {area: False for area in COMPANY_FOCUS_AREAS}

    for tag, count in tag_frequency.items():
    
        focus = cp_tag_to_company_focus(tag)
        if focus is None:
            continue
        counts[focus] += count
        if tag in weak_topics:
            is_weak[focus] = True
        if tag in strong_topics:
            is_strong[focus] = True

    for tag in weak_topics:
        focus = cp_tag_to_company_focus(tag)
        if focus:
            is_weak[focus] = True

    for tag in strong_topics:
        focus = cp_tag_to_company_focus(tag)
        if focus:
            is_strong[focus] = True

    profile: dict[str, dict[str, Any]] = {}
    for area in COMPANY_FOCUS_AREAS:
        solved_count = counts[area]
        if is_weak[area]:
            status = "weak"
        elif is_strong[area]:
            status = "strong"
        elif solved_count == 0:
            status = "needs_practice"
        else:
            status = "neutral"

        profile[area] = {
            "status": status,
            "solved_count": solved_count,
        }

    return profile
