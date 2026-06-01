"""Recent rating change and trend derived from contest history."""

from __future__ import annotations

from typing import Literal

RatingTrend = Literal["improving", "declining", "stable"]


class RatingTrendAnalyzer:
    def recent_rating_delta(self, rating_history: dict) -> int | None:
        """Return change from the previous contest rating to the latest contest rating."""
        entries = _history_entries(rating_history)
        if len(entries) < 2:
            return None

        previous_rating = entries[-2].get("newRating")
        latest_rating = entries[-1].get("newRating")
        if previous_rating is None or latest_rating is None:
            return None
        return latest_rating - previous_rating

    def rating_trend(self, rating_history: dict) -> RatingTrend:
        """Classify recent rating movement as improving, declining, or stable."""
        recent_delta = self.recent_rating_delta(rating_history)
        if recent_delta is None or recent_delta == 0:
            return "stable"
        if recent_delta > 0:
            return "improving"
        return "declining"


def _history_entries(rating_history: dict) -> list[dict]:
    return rating_history.get("result") or []
