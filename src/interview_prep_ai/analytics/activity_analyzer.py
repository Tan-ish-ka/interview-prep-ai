"""Problem-solving activity analytics derived from solved problems."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TypedDict

from interview_prep_ai.core.models.problem import ProblemRecord

_AVERAGE_WINDOW_DAYS = 90


class ActivityStats(TypedDict):
    problems_last_30_days: int
    problems_last_90_days: int
    average_problems_per_week: float


class ActivityAnalyzer:
    def activity_stats(self, problems: list[ProblemRecord]) -> ActivityStats:
        """Summarize recent solve counts and weekly solve rate."""
        problems_last_30_days = self._problems_in_last_n_days(problems, days=30)
        problems_last_90_days = self._problems_in_last_n_days(problems, days=90)
        weeks_in_window = _AVERAGE_WINDOW_DAYS / 7
        average_problems_per_week = problems_last_90_days / weeks_in_window

        return {
            "problems_last_30_days": problems_last_30_days,
            "problems_last_90_days": problems_last_90_days,
            "average_problems_per_week": average_problems_per_week,
        }

    def _problems_in_last_n_days(
        self,
        problems: list[ProblemRecord],
        *,
        days: int,
    ) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        count = 0
        for problem in problems:
            if problem.solved_at is None:
                continue
            solved_at = _to_utc(problem.solved_at)
            if solved_at >= cutoff:
                count += 1
        return count


def _to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
