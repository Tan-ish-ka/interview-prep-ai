from dataclasses import dataclass


@dataclass
class TagStat:
    tag: str
    solved_count: int = 0
    attempt_count: int = 0
