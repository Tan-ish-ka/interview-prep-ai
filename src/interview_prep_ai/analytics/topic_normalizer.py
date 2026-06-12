"""Centralized tag normalization for normalized topic labels and hidden-tag filtering."""

from __future__ import annotations

from typing import Iterable

from interview_prep_ai.core.models.tag_stat import TagStat

_HIDDEN_TAGS: set[str] = {
    "broken",
    "schedules",
    "chinese remainder theorem",
    "fft",
    "2-sat",
    "interactive",
    "special",
    "games",
    "probabilities",
    "expression parsing",
    "matrices",
    "meet-in-the-middle",
}

_TOPIC_DISPLAY_MAP: dict[str, str] = {
    "dp": "Dynamic Programming",
    "dynamic programming": "Dynamic Programming",
    "greedy": "Greedy",
    "graphs": "Graphs",
    "binary search": "Binary Search",
    "math": "Math",
    "bitmasks": "Bit Manipulation",
    "bit manipulation": "Bit Manipulation",
    "strings": "Strings",
    "string": "Strings",
    "data structures": "Data Structures",
    "implementation": "Implementation",
    "constructive algorithms": "Constructive Algorithms",
    "probabilities": "Math",
    "number theory": "Math",
    "combinatorics": "Math",
    "geometry": "Math",
    "matrices": "Math",
    "two pointers": "Two Pointers",
    "sliding window": "Sliding Window",
    "dfs and similar": "Graphs",
    "bfs": "Graphs",
    "dijkstra": "Graphs",
    "topological sort": "Graphs",
    "flows": "Graphs",
    "graph matchings": "Graphs",
    "stl": "Data Structures",
    "sets": "Data Structures",
    "maps": "Data Structures",
    "hashing": "Data Structures",
    "hash table": "Data Structures",
    "heap": "Data Structures",
    "heaps": "Data Structures",
    "priority queue": "Data Structures",
    "kmp": "Strings",
    "z-function": "Strings",
    "suffix array": "Strings",
    "ternary search": "Binary Search",
    "brute force": "Constructive Algorithms",
    "backtracking": "Backtracking",
    "queues": "Stacks / Queues",
    "deque": "Stacks / Queues",
    "linked lists": "Linked Lists",
    "trees": "Trees",
    "dfs": "Graphs",
    "dsu": "Graphs",
    "arrays": "Arrays / Strings",
    "sortings": "Arrays / Strings",
    "linked list": "Linked Lists",
}


def _normalize_key(tag: str) -> str:
    return tag.lower().strip()


def normalize_tag(tag: str) -> str | None:
    """Normalize a raw competitive programming tag to a display label.

    Returns None for hidden tags.
    """
    if not tag:
        return None

    key = _normalize_key(tag)
    if key in _HIDDEN_TAGS:
        return None

    return _TOPIC_DISPLAY_MAP.get(key, tag.strip().title())


def normalize_topics(tags: Iterable[str]) -> list[str]:
    """Normalize an iterable of tags, filter hidden tags, and deduplicate."""
    normalized: list[str] = []
    seen: set[str] = set()
    for tag in tags:
        label = normalize_tag(tag)
        if not label:
            continue
        if label in seen:
            continue
        seen.add(label)
        normalized.append(label)
    return normalized


def normalize_tag_frequency(tag_frequency: dict[str, int]) -> dict[str, int]:
    """Normalize frequency data by display label and remove hidden tags."""
    counts: dict[str, int] = {}
    for tag, count in tag_frequency.items():
        label = normalize_tag(tag)
        if not label:
            continue
        counts[label] = counts.get(label, 0) + count
    return dict(sorted(counts.items(), key=lambda item: (-item[1], item[0])))


def normalize_tag_stats(tag_stats: list[TagStat]) -> list[TagStat]:
    """Normalize tag statistics by display label and aggregate duplicates."""
    counts: dict[str, int] = {}
    for stat in tag_stats:
        label = normalize_tag(stat.tag)
        if not label:
            continue
        counts[label] = counts.get(label, 0) + stat.solved_count
    return [TagStat(tag=tag, solved_count=count, attempt_count=0) for tag, count in sorted(counts.items())]
