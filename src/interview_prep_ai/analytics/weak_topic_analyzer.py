"""Identify topics with low solved counts."""

from __future__ import annotations

from interview_prep_ai.core.models.tag_stat import TagStat

_WEAK_SOLVED_THRESHOLD = 5


class WeakTopicAnalyzer:
    def weak_topics(self, tag_stats: list[TagStat]) -> list[str]:
        """Return weak topic tags sorted by solved_count ascending."""
        weak = [stat for stat in tag_stats if stat.solved_count < _WEAK_SOLVED_THRESHOLD]
        weak.sort(key=lambda stat: (stat.solved_count, stat.tag))
        return [stat.tag for stat in weak]
