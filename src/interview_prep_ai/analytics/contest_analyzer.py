"""Contest participation analytics derived from rating history."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TypedDict


class ContestStats(TypedDict):
    total_contests: int
    contests_last_30_days: int
    average_rating_change: float | None


class ContestAnalyzer:
    def contest_stats(self, rating_history: dict, *, days: int = 30) -> ContestStats:
        """Summarize contest counts and average per-contest rating change."""
        entries = _history_entries(rating_history)
        return {
            "total_contests": len(entries),
            "contests_last_30_days": self._contests_last_n_days(entries, days=days),
            "average_rating_change": self._average_rating_change(entries),
        }

    def _contests_last_n_days(self, entries: list[dict], *, days: int) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        count = 0
        for entry in entries:
            timestamp = entry.get("ratingUpdateTimeSeconds")
            if timestamp is None:
                continue
            contest_time = datetime.fromtimestamp(timestamp, tz=timezone.utc)
            if contest_time >= cutoff:
                count += 1
        return count

    def _average_rating_change(self, entries: list[dict]) -> float | None:
        changes: list[int] = []
        for entry in entries:
            old_rating = entry.get("oldRating")
            new_rating = entry.get("newRating")
            if old_rating is None or new_rating is None:
                continue
            changes.append(new_rating - old_rating)
        if not changes:
            return None
        return sum(changes) / len(changes)


def _history_entries(rating_history: dict) -> list[dict]:
    return rating_history.get("result") or []
