from datetime import datetime, timedelta, timezone

import pytest

from interview_prep_ai.analytics.activity_analyzer import ActivityAnalyzer
from interview_prep_ai.core.models.problem import ProblemRecord


@pytest.fixture
def analyzer() -> ActivityAnalyzer:
    return ActivityAnalyzer()


def test_empty_problems(analyzer: ActivityAnalyzer) -> None:
    assert analyzer.activity_stats([]) == {
        "problems_last_30_days": 0,
        "problems_last_90_days": 0,
        "average_problems_per_week": 0.0,
    }


def test_problems_without_timestamps_are_excluded(analyzer: ActivityAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1A", title="Untimed A"),
        ProblemRecord(problem_id="1B", title="Untimed B"),
    ]

    assert analyzer.activity_stats(problems) == {
        "problems_last_30_days": 0,
        "problems_last_90_days": 0,
        "average_problems_per_week": 0.0,
    }


def test_recent_problem_counts(analyzer: ActivityAnalyzer) -> None:
    now = datetime.now(timezone.utc)
    problems = [
        ProblemRecord(
            problem_id="1",
            title="Recent",
            solved_at=now - timedelta(days=5),
        ),
        ProblemRecord(
            problem_id="2",
            title="Mid window",
            solved_at=now - timedelta(days=45),
        ),
        ProblemRecord(
            problem_id="3",
            title="Older",
            solved_at=now - timedelta(days=120),
        ),
        ProblemRecord(problem_id="4", title="No timestamp"),
    ]

    stats = analyzer.activity_stats(problems)

    assert stats["problems_last_30_days"] == 1
    assert stats["problems_last_90_days"] == 2
    assert stats["average_problems_per_week"] == 2 / (90 / 7)


def test_average_problems_per_week_uses_90_day_window(analyzer: ActivityAnalyzer) -> None:
    now = datetime.now(timezone.utc)
    problems = [
        ProblemRecord(
            problem_id=f"{index}",
            title=f"Problem {index}",
            solved_at=now - timedelta(days=10),
        )
        for index in range(9)
    ]

    stats = analyzer.activity_stats(problems)

    assert stats["problems_last_90_days"] == 9
    assert stats["average_problems_per_week"] == 9 / (90 / 7)
