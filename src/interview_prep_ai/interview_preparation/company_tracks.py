"""Configurable company interview tracks with weighted focus areas."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class CompanyTrack:
    name: str
    weights: dict[str, float] = field(default_factory=dict)


def _w(**weights: float) -> dict[str, float]:
    return weights


# Weights are relative priorities — higher means more important for that track.
COMPANY_TRACKS: tuple[CompanyTrack, ...] = (
    CompanyTrack("Google", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.2, "Graphs": 1.1,
        "Dynamic Programming": 1.3, "Greedy": 0.9, "Binary Search": 1.0,
        "Sliding Window": 1.0, "Heaps": 0.9, "Backtracking": 0.8,
    })),
    CompanyTrack("Amazon", _w(**{
        "Arrays / Strings": 1.3, "Hashing": 1.1, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Stacks / Queues": 1.0,
        "Sliding Window": 1.1, "Binary Search": 0.9, "Heaps": 0.8,
    })),
    CompanyTrack("Microsoft", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.1, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Binary Search": 1.0, "Linked Lists": 0.9,
        "Stacks / Queues": 0.9, "Greedy": 0.8, "Intervals": 0.8,
    })),
    CompanyTrack("Meta", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.2, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 1.0, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Backtracking": 0.8, "Heaps": 0.8,
    })),
    CompanyTrack("Apple", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.1, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 1.0, "Greedy": 0.8, "Bit Manipulation": 0.8,
    })),
    CompanyTrack("Netflix", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Backtracking": 0.8,
    })),
    CompanyTrack("Uber", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.2, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Heaps": 1.0,
        "Intervals": 1.0, "Binary Search": 0.9, "Sliding Window": 0.9,
    })),
    CompanyTrack("Adobe", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Binary Search": 1.0,
        "Greedy": 0.8, "Stacks / Queues": 0.8, "Math": 0.7,
    })),
    CompanyTrack("Salesforce", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 0.9,
        "Greedy": 0.8, "Binary Search": 0.9, "Intervals": 0.8,
    })),
    CompanyTrack("Oracle", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Linked Lists": 0.9, "Stacks / Queues": 1.0,
        "Binary Search": 0.9, "Greedy": 0.8, "Math": 0.7,
    })),
    CompanyTrack("LinkedIn", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Sliding Window": 1.0,
        "Binary Search": 0.9, "Heaps": 0.8, "Intervals": 0.8,
    })),
    CompanyTrack("Atlassian", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 0.9, "Stacks / Queues": 0.9,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Backtracking": 0.7,
    })),
    CompanyTrack("Airbnb", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Intervals": 1.0,
        "Sliding Window": 1.0, "Binary Search": 0.9, "Heaps": 0.8,
    })),
    CompanyTrack("Stripe", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Binary Search": 1.0,
        "Stacks / Queues": 0.9, "Intervals": 0.8, "Math": 0.8,
    })),
    CompanyTrack("Databricks", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.2, "Greedy": 0.9, "Heaps": 1.0,
        "Binary Search": 0.9, "Sliding Window": 0.9, "Math": 0.7,
    })),
    CompanyTrack("Snowflake", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.2, "Binary Search": 1.0, "Heaps": 0.9,
        "Greedy": 0.8, "Stacks / Queues": 0.8, "Math": 0.7,
    })),
    CompanyTrack("NVIDIA", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Trees": 1.0, "Graphs": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 0.9, "Bit Manipulation": 1.0,
        "Math": 0.9, "Binary Search": 0.9, "Heaps": 0.8,
    })),
    CompanyTrack("Intuit", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Linked Lists": 0.9,
        "Binary Search": 0.9, "Stacks / Queues": 0.8, "Intervals": 0.8,
    })),
    CompanyTrack("Bloomberg", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.1, "Heaps": 1.2, "Graphs": 1.0,
        "Trees": 1.0, "Dynamic Programming": 1.1, "Stacks / Queues": 1.0,
        "Greedy": 0.9, "Binary Search": 0.9, "Sliding Window": 0.8,
    })),
    CompanyTrack("Goldman Sachs", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Graphs": 1.0, "Trees": 1.0,
        "Dynamic Programming": 1.1, "Greedy": 1.0, "Math": 1.0,
        "Binary Search": 0.9, "Heaps": 0.9, "Stacks / Queues": 0.8,
    })),
    CompanyTrack("JPMorgan", _w(**{
        "Arrays / Strings": 1.2, "Hashing": 1.0, "Trees": 1.0, "Graphs": 0.9,
        "Dynamic Programming": 1.0, "Greedy": 0.9, "Math": 1.0,
        "Binary Search": 0.9, "Linked Lists": 0.8, "Stacks / Queues": 0.8,
    })),
    CompanyTrack("Citadel", _w(**{
        "Arrays / Strings": 1.1, "Hashing": 1.0, "Graphs": 1.1, "Trees": 1.0,
        "Dynamic Programming": 1.3, "Greedy": 1.0, "Math": 1.2,
        "Binary Search": 1.0, "Heaps": 1.0, "Bit Manipulation": 0.9,
    })),
)


def get_company_tracks() -> tuple[CompanyTrack, ...]:
    """Return configured company tracks (add/remove entries in COMPANY_TRACKS)."""
    cleaned: list[CompanyTrack] = []
    for track in COMPANY_TRACKS:
        weights = {
            area: weight
            for area, weight in track.weights.items()
            if weight > 0
        }
        cleaned.append(CompanyTrack(name=track.name, weights=weights))
    return tuple(cleaned)
