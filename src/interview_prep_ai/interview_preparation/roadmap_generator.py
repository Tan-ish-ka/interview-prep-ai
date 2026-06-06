"""Company-interview preparation roadmap from insights and focus areas."""

from __future__ import annotations

from typing import Any


def build_roadmap(
    insights: dict[str, Any],
    focus_areas: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Return a prioritized, interview-oriented preparation roadmap."""
    items: list[dict[str, Any]] = []
    priority = 1

    weak_areas = [area["area"] for area in focus_areas if area["status"] == "weak"]
    if weak_areas:
        labels = ", ".join(weak_areas[:3])
        items.append(
            _item(
                priority=priority,
                category="weak_topic_practice",
                title="Strengthen weak interview topics",
                description=(
                    f"Prioritize company-style problems in: {labels}. "
                    "Use LeetCode medium problems with timed practice."
                ),
            )
        )
        priority += 1

    needs_practice = [
        area["area"] for area in focus_areas if area["status"] == "needs_practice"
    ]
    if needs_practice:
        labels = ", ".join(needs_practice[:3])
        items.append(
            _item(
                priority=priority,
                category="company_dsa",
                title="Build missing DSA foundations",
                description=(
                    f"Start structured practice in: {labels}. "
                    "Cover one pattern per week with 8–12 curated problems."
                ),
            )
        )
        priority += 1

    contest_stats = insights.get("contest_stats") or {}
    contests_last_30 = contest_stats.get("contests_last_30_days", 0)
    if contests_last_30 < 2:
        items.append(
            _item(
                priority=priority,
                category="contest_participation",
                title="Add timed practice sessions",
                description=(
                    "Join at least 2 timed contests or mock rounds per month "
                    "to simulate interview pressure and time management."
                ),
            )
        )
        priority += 1

    activity_stats = insights.get("activity_stats") or {}
    recent_activity = insights.get("recent_activity", 0)
    weekly_volume = activity_stats.get("average_problems_per_week", 0.0)
    if recent_activity < 10 or weekly_volume < 5:
        items.append(
            _item(
                priority=priority,
                category="consistency",
                title="Establish a weekly solving rhythm",
                description=(
                    "Aim for 5+ problems per week with 3 focused sessions. "
                    "Consistency matters more than cramming before interviews."
                ),
            )
        )
        priority += 1

    strong_topics = insights.get("strong_topics") or []
    strong_areas = [area["area"] for area in focus_areas if area["status"] == "strong"]
    if strong_topics or strong_areas:
        labels = ", ".join(strong_areas[:2]) if strong_areas else ", ".join(strong_topics[:2])
        items.append(
            _item(
                priority=priority,
                category="revision",
                title="Use strengths as confidence builders",
                description=(
                    f"Revisit {labels} with 1–2 hard problems weekly to keep "
                    "confidence high while focusing growth elsewhere."
                ),
            )
        )
        priority += 1

    current_rating = insights.get("current_rating")
    difficulty_target = _difficulty_target(current_rating)
    items.append(
        _item(
            priority=priority,
            category="difficulty_progression",
            title="Progress problem difficulty deliberately",
            description=(
                f"Current level suggests focusing on {difficulty_target} problems. "
                "Mix 70% at comfort level and 30% one step harder."
            ),
        )
    )
    priority += 1

    items.append(
        _item(
            priority=priority,
            category="mock_interview",
            title="Schedule mock interview rounds",
            description=(
                "Run 2 mock interviews per week: one coding, one follow-up "
                "with explanation and edge-case analysis."
            ),
        )
    )

    return items


def _difficulty_target(current_rating: int | None) -> str:
    if current_rating is None:
        return "easy-to-medium"
    if current_rating >= 2000:
        return "medium-to-hard"
    if current_rating >= 1400:
        return "medium"
    if current_rating >= 1000:
        return "easy-to-medium"
    return "easy"


def _item(
    *,
    priority: int,
    category: str,
    title: str,
    description: str,
) -> dict[str, Any]:
    return {
        "priority": priority,
        "category": category,
        "title": title,
        "description": description,
    }
