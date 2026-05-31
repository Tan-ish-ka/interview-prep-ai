from dataclasses import dataclass, field

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.tag_stat import TagStat


def _empty_rating_history() -> dict:
    return {"status": "OK", "result": []}


@dataclass
class UserProfile:
    username: str
    platform: Platform
    current_rating: int | None = None
    max_rating: int | None = None
    solved_problems: list[ProblemRecord] = field(default_factory=list)
    tag_stats: list[TagStat] = field(default_factory=list)
    rating_history: dict = field(default_factory=_empty_rating_history)
