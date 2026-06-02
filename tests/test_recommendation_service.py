import pytest

from interview_prep_ai.recommendations.recommendation_service import RecommendationService


@pytest.fixture
def service() -> RecommendationService:
    return RecommendationService()


def _insights(
    *,
    rating_delta: int | None = None,
    recent_rating_delta: int | None = None,
    rating_trend: str = "stable",
    recent_activity: int = 10,
    top_tags: dict[str, int] | None = None,
    total_solved: int = 100,
    weak_topics: list[str] | None = None,
    strong_topics: list[str] | None = None,
    contest_stats: dict | None = None,
    activity_stats: dict | None = None,
) -> dict:
    return {
        "rating_delta": rating_delta,
        "recent_rating_delta": recent_rating_delta,
        "rating_trend": rating_trend,
        "recent_activity": recent_activity,
        "top_tags": top_tags if top_tags is not None else {"dp": 5, "graphs": 3, "greedy": 2},
        "total_solved": total_solved,
        "weak_topics": weak_topics if weak_topics is not None else [],
        "strong_topics": strong_topics if strong_topics is not None else [],
        "contest_stats": contest_stats
        if contest_stats is not None
        else {
            "total_contests": 10,
            "contests_last_30_days": 2,
            "average_rating_change": 10.0,
        },
        "activity_stats": activity_stats
        if activity_stats is not None
        else {
            "problems_last_30_days": 10,
            "problems_last_90_days": 40,
            "average_problems_per_week": 5.0,
        },
    }


def test_no_recommendations_when_all_criteria_met(service: RecommendationService) -> None:
    assert service.generate(_insights()) == []


def test_low_recent_activity(service: RecommendationService) -> None:
    result = service.generate(_insights(recent_activity=9))

    assert len(result) == 1
    assert "consistency" in result[0].lower()


def test_low_total_solved(service: RecommendationService) -> None:
    result = service.generate(_insights(total_solved=99))

    assert len(result) == 1
    assert "foundational" in result[0].lower()


def test_negative_recent_rating_delta(service: RecommendationService) -> None:
    result = service.generate(_insights(recent_rating_delta=-50))

    assert len(result) == 1
    assert "fundamental" in result[0].lower() or "core" in result[0].lower()


def test_none_recent_rating_delta_skips_negative_rule(
    service: RecommendationService,
) -> None:
    assert service.generate(_insights(recent_rating_delta=None)) == []


def test_zero_recent_rating_delta_skips_negative_rule(
    service: RecommendationService,
) -> None:
    assert service.generate(_insights(recent_rating_delta=0)) == []


def test_lifetime_negative_rating_delta_does_not_trigger_dip(
    service: RecommendationService,
) -> None:
    result = service.generate(_insights(rating_delta=-500, recent_rating_delta=25))

    assert result == []


def test_fewer_than_three_top_tags(service: RecommendationService) -> None:
    result = service.generate(_insights(top_tags={"dp": 10, "graphs": 5}))

    assert len(result) == 1
    assert "topic coverage" in result[0].lower() or "broaden" in result[0].lower()


def test_empty_top_tags(service: RecommendationService) -> None:
    result = service.generate(_insights(top_tags={}))

    assert len(result) == 1
    assert "topic coverage" in result[0].lower() or "broaden" in result[0].lower()


def test_multiple_recommendations(service: RecommendationService) -> None:
    result = service.generate(
        {
            "rating_delta": -20,
            "recent_rating_delta": -20,
            "rating_trend": "declining",
            "recent_activity": 2,
            "top_tags": {"math": 1},
            "total_solved": 15,
            "weak_topics": [],
            "strong_topics": [],
            "contest_stats": {
                "total_contests": 10,
                "contests_last_30_days": 2,
                "average_rating_change": 5.0,
            },
            "activity_stats": {
                "problems_last_30_days": 10,
                "problems_last_90_days": 40,
                "average_problems_per_week": 5.0,
            },
        }
    )

    assert len(result) == 5


def test_weak_topic_recommendations(service: RecommendationService) -> None:
    result = service.generate(_insights(weak_topics=["graphs", "math"]))

    assert result == [
        "Practice more graphs problems.",
        "Practice more math problems.",
    ]


def test_strong_topic_recommendations(service: RecommendationService) -> None:
    result = service.generate(_insights(strong_topics=["dp", "greedy"]))

    assert result == [
        "Leverage your strength in dp.",
        "Leverage your strength in greedy.",
    ]


def test_low_contest_participation_recommendation(
    service: RecommendationService,
) -> None:
    result = service.generate(
        _insights(contest_stats={"total_contests": 5, "contests_last_30_days": 1})
    )

    assert result == [
        "Participate in contests more frequently to improve consistency."
    ]


def test_low_weekly_problem_volume_recommendation(
    service: RecommendationService,
) -> None:
    result = service.generate(
        _insights(
            activity_stats={
                "problems_last_30_days": 2,
                "problems_last_90_days": 10,
                "average_problems_per_week": 4.5,
            }
        )
    )

    assert result == ["Increase your weekly problem-solving volume."]


def test_declining_rating_trend_recommendation(service: RecommendationService) -> None:
    result = service.generate(_insights(rating_trend="declining"))

    assert result == [
        "Review recent contest mistakes before your next competition."
    ]


def test_smart_recommendations_with_existing_rules(service: RecommendationService) -> None:
    result = service.generate(
        _insights(
            recent_activity=5,
            rating_trend="declining",
            contest_stats={"total_contests": 3, "contests_last_30_days": 0},
            activity_stats={
                "problems_last_30_days": 1,
                "problems_last_90_days": 8,
                "average_problems_per_week": 2.0,
            },
            weak_topics=["graphs"],
            strong_topics=["dp"],
        )
    )

    assert result == [
        "Increase your practice consistency — aim for more regular solving sessions.",
        "Practice more graphs problems.",
        "Leverage your strength in dp.",
        "Participate in contests more frequently to improve consistency.",
        "Increase your weekly problem-solving volume.",
        "Review recent contest mistakes before your next competition.",
    ]


def test_topic_recommendations_with_existing_rules(service: RecommendationService) -> None:
    result = service.generate(
        _insights(
            recent_activity=5,
            weak_topics=["graphs"],
            strong_topics=["dp"],
        )
    )

    assert result == [
        "Increase your practice consistency — aim for more regular solving sessions.",
        "Practice more graphs problems.",
        "Leverage your strength in dp.",
    ]
