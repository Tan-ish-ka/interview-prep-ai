"""Deterministic AI-style insight generator (no external LLMs)."""

from __future__ import annotations

from typing import Any, Iterable, List

from interview_prep_ai.analytics.topic_normalizer import normalize_topics
from interview_prep_ai.interview_preparation.topic_mapper import (
    cp_tag_to_focus_area,
)


def _round_solved_label(total: int) -> str:
    if total >= 3000:
        return "3k+"
    if total >= 1000:
        return "1k+"
    if total >= 300:
        return "300+"
    if total >= 100:
        return f"{(total//10)*10}+"
    return str(total)


def _pick_top_topics(topics: Iterable[str], limit: int = 3) -> List[str]:
    out: List[str] = []
    seen = set()
    for t in topics:
        if not t:
            continue
        label = t
        if label in seen:
            continue
        seen.add(label)
        out.append(label)
        if len(out) >= limit:
            break
    return out


def _compose_summary(current_rating: int | None, max_rating: int | None, total_solved: int | None) -> str:
    parts: list[str] = []
    if total_solved:
        parts.append(f"You've solved {_round_solved_label(total_solved)} problems")
    if current_rating:
        parts.append(f"and reached a {current_rating} rating")
        if max_rating and max_rating != current_rating:
            parts[-1] = parts[-1] + f" (peak {max_rating})"
    if not parts:
        return "Profile data is limited."
    return " ".join(parts) + "."


def _compose_strengths(strong_topics: Iterable[str]) -> str:
    tops = _pick_top_topics(strong_topics, limit=3)
    if not tops:
        return "Coverage is patchy with no dominant strengths yet."
    if len(tops) == 1:
        return f"Your strongest area is {tops[0]}."
    if len(tops) == 2:
        return f"Your strongest areas are {tops[0]} and {tops[1]}."
    return f"Your strongest areas are {tops[0]}, {tops[1]}, and {tops[2]}."


def _compose_growth_opportunity(contest_count: int | None, recent_activity: int | None, weak_topics: Iterable[str], growth_potential: float | None) -> str:
    weak = _pick_top_topics(weak_topics, limit=2)
    if contest_count is not None and contest_count == 0:
        return "No contests detected in the last 30 days — this limits rating progress."
    if recent_activity is not None and recent_activity < 10:
        if weak:
            return f"Low practice volume and weaknesses in {', '.join(weak)} are limiting progress."
        return "Low practice volume is limiting progress."
    if weak:
        return f"Opportunity to grow in {', '.join(weak)}."
    if growth_potential is not None:
        if growth_potential >= 0.75:
            return "High growth potential — focus on converting momentum into rating gains."
        if growth_potential >= 0.4:
            return "Moderate growth potential with room for focused practice."
        return "Limited growth potential without increased practice and contest participation."
    return "Continue steady practice to convert skills into rating gains."


def _compose_recommendation(contest_count: int | None, recent_activity: int | None, weak_topics: Iterable[str], strong_topics: Iterable[str]) -> str:
    weak = _pick_top_topics(weak_topics, limit=2)
    strong = _pick_top_topics(strong_topics, limit=2)
    parts: list[str] = []
    # contest directive
    if contest_count is None or contest_count == 0:
        parts.append("Join at least 2 contests per month")
    elif contest_count < 2:
        parts.append("Increase contest participation to ~2 per month")
    else:
        parts.append("Maintain contest cadence")

    # practice directive
    if recent_activity is not None and recent_activity < 10:
        parts.append("aim for 5+ problems per week")
    else:
        parts.append("keep a steady weekly practice rhythm")

    # topic directive
    if weak:
        parts.append(f"focus extra practice on {', '.join(weak)}")
    elif strong:
        parts.append(f"maintain strengths in {', '.join(strong)}")

    sentence = ", then ".join(parts) + "."
    return sentence


def _compute_readiness_score(insights: dict[str, Any]) -> int:
    # Combine skill proxies into a 0-100 score deterministically.
    score = 0.0
    skill = float(insights.get("skill_score", 0))
    momentum = float(insights.get("momentum_score", 0))
    total_solved = int(insights.get("total_solved", 0) or 0)
    recent_activity = float(insights.get("recent_activity", 0) or 0)

    score += min(50.0, skill * 0.5)
    score += min(20.0, momentum * 0.2)
    score += min(15.0, total_solved / 100.0)
    score += min(15.0, recent_activity * 1.0)

    return max(0, min(100, round(score)))


def generate_ai_insight(insights: dict[str, Any]) -> dict[str, Any]:
    """Return deterministic AI-style insight dictionary.

    Fields: summary, strengths, growth_opportunity, recommendation, readiness_score
    """
    current_rating = insights.get("current_rating")
    max_rating = insights.get("max_rating")
    total_solved = insights.get("total_solved")
    contest_stats = insights.get("contest_stats") or {}
    contest_count = contest_stats.get("contests_last_30_days")
    recent_activity = insights.get("recent_activity")
    strong_topics = normalize_topics(insights.get("strong_topics") or [])
    weak_topics = normalize_topics(insights.get("weak_topics") or [])
    growth_potential = insights.get("potential_efficiency") or insights.get("growth_potential")

    # Ensure topics are display-safe: map via cp_tag_to_focus_area when raw tags detected
    # Only include tags that map to a known focus area; skip unmapped/raw tags to avoid leaking
    safe_strong: list[str] = []
    for t in strong_topics:
        mapped = cp_tag_to_focus_area(t)
        if mapped:
            safe_strong.append(mapped)

    safe_weak: list[str] = []
    for t in weak_topics:
        mapped = cp_tag_to_focus_area(t)
        if mapped:
            safe_weak.append(mapped)

    summary = _compose_summary(current_rating, max_rating, total_solved)
    strengths = _compose_strengths(safe_strong)
    growth = _compose_growth_opportunity(contest_count, recent_activity, safe_weak, growth_potential)
    recommendation = _compose_recommendation(contest_count, recent_activity, safe_weak, safe_strong)
    readiness = _compute_readiness_score(insights)

    # Ensure overall length under ~120 words: trim recommendation if needed
    combined = " ".join([summary, strengths, growth, recommendation])
    if len(combined.split()) > 120:
        # shorten recommendation clause
        recommendation = recommendation.split(", then ")[0] + "."

    return {
        "summary": summary,
        "strengths": strengths,
        "growth_opportunity": growth,
        "recommendation": recommendation,
        "readiness_score": readiness,
    }
