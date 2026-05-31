"""Solved-problem activity analytics derived from problem records."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from interview_prep_ai.core.models.problem import ProblemRecord


class ProblemAnalyzer:
    def total_solved(self, problems: list[ProblemRecord]) -> int:
        return len(problems)

    def recent_activity(self, problems: list[ProblemRecord], days: int = 30) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        count = 0
        for problem in problems:
            if problem.solved_at is None:
                continue
            solved_at = _to_utc(problem.solved_at)
            if solved_at >= cutoff:
                count += 1
        return count

    def activity_by_month(self, problems: list[ProblemRecord]) -> dict[str, int]:
        counts: dict[str, int] = {}
        for problem in problems:
            if problem.solved_at is None:
                continue
            month_key = _to_utc(problem.solved_at).strftime("%Y-%m")
            counts[month_key] = counts.get(month_key, 0) + 1
        return dict(sorted(counts.items()))


def _to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
