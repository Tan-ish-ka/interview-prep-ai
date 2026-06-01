"""Identify top-performing topics by solved count."""

from __future__ import annotations

from interview_prep_ai.core.models.tag_stat import TagStat

_TOP_STRONG_COUNT = 3


class StrongTopicAnalyzer:
    def strong_topics(self, tag_stats: list[TagStat]) -> list[str]:
        """Return up to three strongest topic tags by solved_count descending."""
        ranked = sorted(tag_stats, key=lambda stat: (-stat.solved_count, stat.tag))
        return [stat.tag for stat in ranked[:_TOP_STRONG_COUNT]]
