import pytest

from interview_prep_ai.recommendations.recommendation_service import RecommendationService


@pytest.fixture
def service() -> RecommendationService:
    return RecommendationService()


def _insights(
    *,
    rating_delta: int | None = None,
    recent_activity: int = 10,
    top_tags: dict[str, int] | None = None,
    total_solved: int = 100,
    weak_topics: list[str] | None = None,
    strong_topics: list[str] | None = None,
) -> dict:
    return {
        "rating_delta": rating_delta,
        "recent_activity": recent_activity,
        "top_tags": top_tags if top_tags is not None else {"dp": 5, "graphs": 3, "greedy": 2},
        "total_solved": total_solved,
        "weak_topics": weak_topics if weak_topics is not None else [],
        "strong_topics": strong_topics if strong_topics is not None else [],
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


def test_negative_rating_delta(service: RecommendationService) -> None:
    result = service.generate(_insights(rating_delta=-50))

    assert len(result) == 1
    assert "fundamental" in result[0].lower() or "core" in result[0].lower()


def test_none_rating_delta_skips_negative_rule(service: RecommendationService) -> None:
    assert service.generate(_insights(rating_delta=None)) == []


def test_zero_rating_delta_skips_negative_rule(service: RecommendationService) -> None:
    assert service.generate(_insights(rating_delta=0)) == []


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
            "recent_activity": 2,
            "top_tags": {"math": 1},
            "total_solved": 15,
            "weak_topics": [],
            "strong_topics": [],
        }
    )

    assert len(result) == 4


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
