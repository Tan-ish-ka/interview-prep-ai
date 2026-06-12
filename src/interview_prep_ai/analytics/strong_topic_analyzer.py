"""Identify top-performing topics by solved count."""

from __future__ import annotations

from interview_prep_ai.analytics.topic_normalizer import normalize_tag
from interview_prep_ai.core.models.tag_stat import TagStat

_MIN_SOLVED_THRESHOLD = 10
_TOP_STRONG_COUNT = 3


class StrongTopicAnalyzer:
    def strong_topics(self, tag_stats: list[TagStat]) -> list[str]:
        """Return up to three strongest tags that meet the minimum solve threshold."""
        counts: dict[str, int] = {}
        for stat in tag_stats:
            normalized = normalize_tag(stat.tag)
            if not normalized:
                continue
            counts[normalized] = counts.get(normalized, 0) + stat.solved_count

        qualifying = [
            (tag, total)
            for tag, total in counts.items()
            if total >= _MIN_SOLVED_THRESHOLD
        ]
        ranked = sorted(qualifying, key=lambda item: (-item[1], item[0]))
        return [tag for tag, _ in ranked[:_TOP_STRONG_COUNT]]
