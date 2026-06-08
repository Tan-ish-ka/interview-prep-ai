from interview_prep_ai.analytics.insight_generator import InsightGenerator
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.platforms.codeforces.solved_problems import (
    SOLVED_COUNT_DEFINITION,
    count_unique_solved_submissions,
    problem_key,
    solved_problems_from_submissions,
)


def _submission(
    *,
    verdict: str = "OK",
    contest_id: int | None = 1,
    index: str = "A",
    name: str = "Problem",
    problem_type: str = "PROGRAMMING",
    tags: list[str] | None = None,
    creation_time: int = 1_700_000_000,
) -> dict:
    return {
        "verdict": verdict,
        "creationTimeSeconds": creation_time,
        "problem": {
            "contestId": contest_id,
            "index": index,
            "name": name,
            "type": problem_type,
            "tags": tags or [],
        },
    }


def test_problem_key_avoids_contest_index_collision() -> None:
    assert problem_key({"contestId": 1, "index": "2A"}) != problem_key(
        {"contestId": 12, "index": "A"}
    )


def test_counts_unique_ok_programming_problems_only() -> None:
    submissions = [
        _submission(contest_id=1, index="A"),
        _submission(contest_id=1, index="A", creation_time=1_700_000_100),
        _submission(contest_id=1, index="B"),
        _submission(verdict="WRONG_ANSWER", contest_id=2, index="C"),
        _submission(contest_id=3, index="D", problem_type="QUESTION"),
    ]

    assert count_unique_solved_submissions(submissions) == 2
    assert len(solved_problems_from_submissions(submissions)) == 2


def test_solved_records_match_unique_count() -> None:
    submissions = [
        _submission(contest_id=10, index="A", tags=["dp"]),
        _submission(contest_id=10, index="B", tags=["graphs"]),
        _submission(contest_id=11, index="A", tags=["dp"]),
    ]

    records = solved_problems_from_submissions(submissions)
    assert len(records) == count_unique_solved_submissions(submissions) == 3


def test_empty_submissions_returns_zero() -> None:
    assert count_unique_solved_submissions([]) == 0
    assert solved_problems_from_submissions([]) == []


def test_insight_total_solved_matches_profile_total_solved() -> None:
    profile = UserProfile(
        username="solver",
        platform=Platform.CODEFORCES,
        total_solved=727,
        solved_problems=[],
    )
    insights = InsightGenerator().generate(profile, {"status": "OK", "result": []})

    assert insights["total_solved"] == 727
    assert insights["solved_count_definition"] == SOLVED_COUNT_DEFINITION


def test_insight_falls_back_to_solved_problems_length_for_legacy_profiles() -> None:
    from interview_prep_ai.core.models.problem import ProblemRecord

    profile = UserProfile(
        username="legacy",
        platform=Platform.CODEFORCES,
        solved_problems=[
            ProblemRecord(problem_id="1A", title="A"),
            ProblemRecord(problem_id="1B", title="B"),
        ],
    )
    insights = InsightGenerator().generate(profile, {"status": "OK", "result": []})

    assert insights["total_solved"] == 2
