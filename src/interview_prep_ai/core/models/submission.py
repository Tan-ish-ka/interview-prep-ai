from dataclasses import dataclass
from datetime import datetime

from interview_prep_ai.core.models.problem import ProblemRecord


@dataclass
class SubmissionRecord:
    id: str
    problem: ProblemRecord
    verdict: str
    language: str
    time_consumed_millis: int
    memory_consumed_bytes: int
    passed_test_count: int
    participant_type: str = ""
    relative_time_seconds: int = 0
    submitted_at: datetime | None = None
