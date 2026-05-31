from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ProblemRecord:
    problem_id: str
    title: str
    tags: list[str] = field(default_factory=list)
    solved_at: datetime | None = None
