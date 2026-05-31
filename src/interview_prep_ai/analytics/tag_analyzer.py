"""Tag frequency analytics derived from solved problem records."""

from __future__ import annotations

from interview_prep_ai.core.models.problem import ProblemRecord


class TagAnalyzer:
    def tag_frequency(self, problems: list[ProblemRecord]) -> dict[str, int]:
        counts: dict[str, int] = {}
        for problem in problems:
            for tag in problem.tags:
                normalized = tag.lower()
                counts[normalized] = counts.get(normalized, 0) + 1
        return dict(sorted(counts.items(), key=lambda item: (-item[1], item[0])))
