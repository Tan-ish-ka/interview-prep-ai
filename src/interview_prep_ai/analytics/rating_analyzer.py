"""Rating analytics derived from contest rating history."""

from __future__ import annotations


class RatingAnalyzer:
    def current_rating(self, rating_history: dict) -> int | None:
        entries = _history_entries(rating_history)
        if not entries:
            return None
        return entries[-1].get("newRating")

    def max_rating(self, rating_history: dict) -> int | None:
        entries = _history_entries(rating_history)
        if not entries:
            return None
        return max(entry.get("newRating", 0) for entry in entries)

    def rating_delta(self, rating_history: dict) -> int | None:
        entries = _history_entries(rating_history)
        if not entries:
            return None
        old_rating = entries[0].get("oldRating")
        new_rating = entries[-1].get("newRating")
        if old_rating is None or new_rating is None:
            return None
        return new_rating - old_rating


def _history_entries(rating_history: dict) -> list[dict]:
    return rating_history.get("result") or []
