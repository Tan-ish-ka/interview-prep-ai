from datetime import datetime, timedelta, timezone

import pytest

from interview_prep_ai.analytics.insight_generator import InsightGenerator
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat


@pytest.fixture
def generator() -> InsightGenerator:
    return InsightGenerator()


def test_empty_profile(generator: InsightGenerator) -> None:
    profile = UserProfile(username="empty_user", platform=Platform.CODEFORCES)
    rating_history = {"status": "OK", "result": []}

    insights = generator.generate(profile, rating_history)

    assert insights == {
        "current_rating": None,
        "max_rating": None,
        "rating_delta": None,
        "total_solved": 0,
        "recent_activity": 0,
        "top_tags": {},
        "weak_topics": [],
    }


def test_profile_with_solved_problems(generator: InsightGenerator) -> None:
    now = datetime.now(timezone.utc)
    profile = UserProfile(
        username="solver",
        platform=Platform.CODEFORCES,
        solved_problems=[
            ProblemRecord(
                problem_id="1A",
                title="Theatre Square",
                tags=["math"],
                solved_at=now - timedelta(days=3),
            ),
            ProblemRecord(
                problem_id="4A",
                title="Watermelon",
                tags=["implementation"],
                solved_at=now - timedelta(days=60),
            ),
            ProblemRecord(problem_id="71A", title="Way Too Long Words"),
        ],
    )

    insights = generator.generate(profile, {"status": "OK", "result": []})

    assert insights["total_solved"] == 3
    assert insights["recent_activity"] == 1


def test_rating_history_present(generator: InsightGenerator) -> None:
    profile = UserProfile(username="rated_user", platform=Platform.CODEFORCES)
    rating_history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1600},
            {"contestId": 2, "oldRating": 1600, "newRating": 1550},
            {"contestId": 3, "oldRating": 1550, "newRating": 1700},
        ],
    }

    insights = generator.generate(profile, rating_history)

    assert insights["current_rating"] == 1700
    assert insights["max_rating"] == 1700
    assert insights["rating_delta"] == 200


def test_tag_ranking(generator: InsightGenerator) -> None:
    profile = UserProfile(
        username="tag_user",
        platform=Platform.CODEFORCES,
        solved_problems=[
            ProblemRecord(problem_id="1", title="A", tags=["graphs", "dp"]),
            ProblemRecord(problem_id="2", title="B", tags=["graphs", "greedy"]),
            ProblemRecord(problem_id="3", title="C", tags=["graphs", "dp", "greedy"]),
            ProblemRecord(problem_id="4", title="D", tags=["math"]),
            ProblemRecord(problem_id="5", title="E", tags=["math", "number theory"]),
            ProblemRecord(problem_id="6", title="F", tags=["strings"]),
            ProblemRecord(problem_id="7", title="G", tags=["binary search"]),
            ProblemRecord(problem_id="8", title="H", tags=["two pointers"]),
        ],
    )

    insights = generator.generate(profile, {"status": "OK", "result": []})

    assert insights["top_tags"] == {
        "graphs": 3,
        "dp": 2,
        "greedy": 2,
        "math": 2,
        "binary search": 1,
    }
    assert len(insights["top_tags"]) == 5


def test_weak_topics_from_tag_stats(generator: InsightGenerator) -> None:
    profile = UserProfile(
        username="weak_tag_user",
        platform=Platform.CODEFORCES,
        tag_stats=[
            TagStat(tag="dp", solved_count=12),
            TagStat(tag="graphs", solved_count=3),
            TagStat(tag="greedy", solved_count=5),
            TagStat(tag="math", solved_count=1),
        ],
    )

    insights = generator.generate(profile, {"status": "OK", "result": []})

    assert insights["weak_topics"] == ["math", "graphs"]
