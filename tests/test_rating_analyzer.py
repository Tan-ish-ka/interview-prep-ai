import pytest

from interview_prep_ai.analytics.rating_analyzer import RatingAnalyzer


@pytest.fixture
def analyzer() -> RatingAnalyzer:
    return RatingAnalyzer()


def test_empty_history(analyzer: RatingAnalyzer) -> None:
    history = {"status": "OK", "result": []}

    assert analyzer.current_rating(history) is None
    assert analyzer.max_rating(history) is None
    assert analyzer.rating_delta(history) is None


def test_single_contest(analyzer: RatingAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1620},
        ],
    }

    assert analyzer.current_rating(history) == 1620
    assert analyzer.max_rating(history) == 1620
    assert analyzer.rating_delta(history) == 120


def test_multiple_contests(analyzer: RatingAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1600},
            {"contestId": 2, "oldRating": 1600, "newRating": 1550},
            {"contestId": 3, "oldRating": 1550, "newRating": 1700},
        ],
    }

    assert analyzer.current_rating(history) == 1700
    assert analyzer.max_rating(history) == 1700
    assert analyzer.rating_delta(history) == 200


def test_positive_delta(analyzer: RatingAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 10, "oldRating": 1800, "newRating": 1875},
        ],
    }

    assert analyzer.rating_delta(history) == 75
    assert analyzer.rating_delta(history) > 0


def test_negative_delta(analyzer: RatingAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 20, "oldRating": 2000, "newRating": 1925},
        ],
    }

    assert analyzer.rating_delta(history) == -75
    assert analyzer.rating_delta(history) < 0
