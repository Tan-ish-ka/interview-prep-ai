import pytest

from interview_prep_ai.analytics.tag_analyzer import TagAnalyzer
from interview_prep_ai.core.models.problem import ProblemRecord


@pytest.fixture
def analyzer() -> TagAnalyzer:
    return TagAnalyzer()


def test_empty_problems_list(analyzer: TagAnalyzer) -> None:
    assert analyzer.tag_frequency([]) == {}


def test_single_problem(analyzer: TagAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1A", title="Theatre Square", tags=["math", "implementation"]),
    ]

    assert analyzer.tag_frequency(problems) == {
        "implementation": 1,
        "math": 1,
    }


def test_multiple_problems(analyzer: TagAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1", title="Graph Paths", tags=["graphs", "bfs"]),
        ProblemRecord(problem_id="2", title="Coin Change", tags=["dp"]),
        ProblemRecord(problem_id="3", title="Activity Selection", tags=["greedy", "sortings"]),
    ]

    assert analyzer.tag_frequency(problems) == {
        "bfs": 1,
        "dp": 1,
        "graphs": 1,
        "greedy": 1,
        "sortings": 1,
    }


def test_repeated_tags(analyzer: TagAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1", title="Problem A", tags=["graphs", "dp"]),
        ProblemRecord(problem_id="2", title="Problem B", tags=["graphs", "greedy"]),
        ProblemRecord(problem_id="3", title="Problem C", tags=["graphs", "dp", "greedy"]),
    ]

    assert analyzer.tag_frequency(problems) == {
        "graphs": 3,
        "dp": 2,
        "greedy": 2,
    }


def test_mixed_case_tags(analyzer: TagAnalyzer) -> None:
    problems = [
        ProblemRecord(problem_id="1", title="Problem A", tags=["DP", "Graphs"]),
        ProblemRecord(problem_id="2", title="Problem B", tags=["dp", "GRAPHS"]),
        ProblemRecord(problem_id="3", title="Problem C", tags=["Dp"]),
    ]

    assert analyzer.tag_frequency(problems) == {
        "dp": 3,
        "graphs": 2,
    }
