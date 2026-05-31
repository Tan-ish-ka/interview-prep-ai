from datetime import datetime, timedelta, timezone

import pytest

from interview_prep_ai.analytics.problem_analyzer import ProblemAnalyzer
from interview_prep_ai.core.models.problem import ProblemRecord


@pytest.fixture
def analyzer() -> ProblemAnalyzer:
    return ProblemAnalyzer()


def test_empty_problems_list(analyzer: ProblemAnalyzer) -> None:
    assert analyzer.total_solved([]) == 0
    assert analyzer.recent_activity([]) == 0
    assert analyzer.activity_by_month([]) == {}


def test_total_solved(analyzer: ProblemAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1A", title="Theatre Square"),
        ProblemRecord(problem_id="4A", title="Watermelon"),
        ProblemRecord(
            problem_id="71A",
            title="Way Too Long Words",
            solved_at=datetime(2024, 6, 1, tzinfo=timezone.utc),
        ),
    ]

    assert analyzer.total_solved(problems) == 3


def test_recent_activity(analyzer: ProblemAnalyzer) -> None:
    now = datetime.now(timezone.utc)
    problems = [
        ProblemRecord(
            problem_id="1",
            title="Recent A",
            solved_at=now - timedelta(days=5),
        ),
        ProblemRecord(
            problem_id="2",
            title="Recent B",
            solved_at=now - timedelta(days=20),
        ),
        ProblemRecord(
            problem_id="3",
            title="No date",
            solved_at=None,
        ),
    ]

    assert analyzer.recent_activity(problems, days=30) == 2


def test_old_activity(analyzer: ProblemAnalyzer) -> None:
    now = datetime.now(timezone.utc)
    problems = [
        ProblemRecord(
            problem_id="1",
            title="Old A",
            solved_at=now - timedelta(days=45),
        ),
        ProblemRecord(
            problem_id="2",
            title="Old B",
            solved_at=now - timedelta(days=90),
        ),
    ]

    assert analyzer.recent_activity(problems, days=30) == 0


def test_monthly_grouping(analyzer: ProblemAnalyzer) -> None:
    problems = [
        ProblemRecord(
            problem_id="1",
            title="Jan A",
            solved_at=datetime(2025, 1, 5, tzinfo=timezone.utc),
        ),
        ProblemRecord(
            problem_id="2",
            title="Jan B",
            solved_at=datetime(2025, 1, 28, tzinfo=timezone.utc),
        ),
        ProblemRecord(
            problem_id="3",
            title="Feb A",
            solved_at=datetime(2025, 2, 10, tzinfo=timezone.utc),
        ),
        ProblemRecord(
            problem_id="4",
            title="No date",
            solved_at=None,
        ),
    ]

    assert analyzer.activity_by_month(problems) == {
        "2025-01": 2,
        "2025-02": 1,
    }
