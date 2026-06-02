from datetime import datetime, timedelta, timezone

import pytest

from interview_prep_ai.analytics.contest_analyzer import ContestAnalyzer


@pytest.fixture
def analyzer() -> ContestAnalyzer:
    return ContestAnalyzer()


def test_empty_history(analyzer: ContestAnalyzer) -> None:
    history = {"status": "OK", "result": []}

    assert analyzer.contest_stats(history) == {
        "total_contests": 0,
        "contests_last_30_days": 0,
        "average_rating_change": None,
    }


def test_total_contests_and_average_rating_change(analyzer: ContestAnalyzer) -> None:
    history = {
        "status": "OK",
        "result": [
            {"contestId": 1, "oldRating": 1500, "newRating": 1600},
            {"contestId": 2, "oldRating": 1600, "newRating": 1550},
            {"contestId": 3, "oldRating": 1550, "newRating": 1700},
        ],
    }

    stats = analyzer.contest_stats(history)

    assert stats["total_contests"] == 3
    assert stats["average_rating_change"] == 200 / 3


def test_contests_last_30_days(analyzer: ContestAnalyzer) -> None:
    now = datetime.now(timezone.utc)
    recent_timestamp = int((now - timedelta(days=5)).timestamp())
    old_timestamp = int((now - timedelta(days=40)).timestamp())
    history = {
        "status": "OK",
        "result": [
            {
                "contestId": 1,
                "oldRating": 1500,
                "newRating": 1600,
                "ratingUpdateTimeSeconds": recent_timestamp,
            },
            {
                "contestId": 2,
                "oldRating": 1600,
                "newRating": 1620,
                "ratingUpdateTimeSeconds": recent_timestamp,
            },
            {
                "contestId": 3,
                "oldRating": 1620,
                "newRating": 1610,
                "ratingUpdateTimeSeconds": old_timestamp,
            },
        ],
    }

    stats = analyzer.contest_stats(history)

    assert stats["total_contests"] == 3
    assert stats["contests_last_30_days"] == 2


def test_entries_without_timestamp_are_excluded_from_recent_count(
    analyzer: ContestAnalyzer,
) -> None:
    now = datetime.now(timezone.utc)
    recent_timestamp = int((now - timedelta(days=2)).timestamp())
    history = {
        "status": "OK",
        "result": [
            {
                "contestId": 1,
                "oldRating": 1500,
                "newRating": 1600,
                "ratingUpdateTimeSeconds": recent_timestamp,
            },
            {"contestId": 2, "oldRating": 1600, "newRating": 1610},
        ],
    }

    stats = analyzer.contest_stats(history)

    assert stats["contests_last_30_days"] == 1
