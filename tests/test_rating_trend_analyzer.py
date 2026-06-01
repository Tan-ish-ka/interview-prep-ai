import pytest

from interview_prep_ai.analytics.rating_trend_analyzer import RatingTrendAnalyzer


@pytest.fixture
def analyzer() -> RatingTrendAnalyzer:
    return RatingTrendAnalyzer()


def test_empty_history(analyzer: RatingTrendAnalyzer) -> None:
    history = {"status": "OK", "result": []}

    assert analyzer.recent_rating_delta(history) is None
    assert analyzer.rating_trend(history) == "stable"


def test_single_contest(analyzer: RatingTrendAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [{"contestId": 1, "oldRating": 1500, "newRating": 1620}],
    }

    assert analyzer.recent_rating_delta(history) is None
    assert analyzer.rating_trend(history) == "stable"


def test_recent_rating_delta_improving(analyzer: RatingTrendAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1600},
            {"contestId": 2, "oldRating": 1600, "newRating": 1700},
        ],
    }

    assert analyzer.recent_rating_delta(history) == 100
    assert analyzer.rating_trend(history) == "improving"


def test_recent_rating_delta_declining(analyzer: RatingTrendAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1600, "newRating": 1700},
            {"contestId": 2, "oldRating": 1700, "newRating": 1550},
        ],
    }

    assert analyzer.recent_rating_delta(history) == -150
    assert analyzer.rating_trend(history) == "declining"


def test_recent_rating_delta_stable(analyzer: RatingTrendAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1600},
            {"contestId": 2, "oldRating": 1600, "newRating": 1600},
        ],
    }

    assert analyzer.recent_rating_delta(history) == 0
    assert analyzer.rating_trend(history) == "stable"
