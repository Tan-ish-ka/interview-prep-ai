"""Identify top-performing topics by solved count."""

from __future__ import annotations

from interview_prep_ai.core.models.tag_stat import TagStat

_MIN_SOLVED_THRESHOLD = 10
_TOP_STRONG_COUNT = 3


class StrongTopicAnalyzer:
    def strong_topics(self, tag_stats: list[TagStat]) -> list[str]:
        """Return up to three strongest tags that meet the minimum solve threshold."""
        qualifying = [
            stat for stat in tag_stats if stat.solved_count >= _MIN_SOLVED_THRESHOLD
        ]
        ranked = sorted(qualifying, key=lambda stat: (-stat.solved_count, stat.tag))
        return [stat.tag for stat in ranked[:_TOP_STRONG_COUNT]]
