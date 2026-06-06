"""Identify topics weak relative to the user's own tag distribution."""

from __future__ import annotations

from interview_prep_ai.core.models.tag_stat import TagStat

_WEAK_RATIO = 0.5
_MIN_WEAK_THRESHOLD = 5
_TOP_WEAK_COUNT = 5


class WeakTopicAnalyzer:
    def weak_topics(
        self,
        tag_stats: list[TagStat],
        *,
        exclude: set[str] | None = None,
    ) -> list[str]:
        """Return up to five weakest tags below the profile-relative threshold."""
        if not tag_stats:
            return []

        excluded = exclude or set()
        average_solves = sum(stat.solved_count for stat in tag_stats) / len(tag_stats)
        threshold = max(_MIN_WEAK_THRESHOLD, average_solves * _WEAK_RATIO)

        weak = [
            stat
            for stat in tag_stats
            if stat.solved_count > 0
            and stat.solved_count < threshold
            and stat.tag not in excluded
        ]
        weak.sort(key=lambda stat: (stat.solved_count, stat.tag))
        return [stat.tag for stat in weak[:_TOP_WEAK_COUNT]]
