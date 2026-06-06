from interview_prep_ai.analytics.insight_scorer import (
    compute_momentum_score,
    compute_skill_score,
)


def _tourist_like_insights() -> dict:
    return {
        "current_rating": 3858,
        "max_rating": 3919,
        "recent_rating_delta": 12,
        "rating_trend": "stable",
        "total_solved": 1200,
        "recent_activity": 4,
        "contest_stats": {
            "total_contests": 120,
            "contests_last_30_days": 1,
            "average_rating_change": 5.0,
        },
        "activity_stats": {
            "problems_last_30_days": 4,
            "problems_last_90_days": 12,
            "average_problems_per_week": 0.93,
        },
        "strong_topics": ["dp", "graphs", "math"],
        "weak_topics": ["geometry"],
    }


def _active_beginner_insights() -> dict:
    return {
        "current_rating": 1100,
        "max_rating": 1250,
        "recent_rating_delta": 45,
        "rating_trend": "improving",
        "total_solved": 180,
        "recent_activity": 28,
        "contest_stats": {
            "total_contests": 18,
            "contests_last_30_days": 3,
            "average_rating_change": 20.0,
        },
        "activity_stats": {
            "problems_last_30_days": 28,
            "problems_last_90_days": 70,
            "average_problems_per_week": 5.4,
        },
        "strong_topics": ["greedy"],
        "weak_topics": ["dp", "graphs"],
    }


def test_tourist_like_profile_has_very_high_skill_score() -> None:
    score = compute_skill_score(_tourist_like_insights())
    assert score >= 90


def test_tourist_like_profile_has_moderate_momentum_score() -> None:
    score = compute_momentum_score(_tourist_like_insights())
    assert 30 <= score <= 65


def test_active_beginner_has_lower_skill_than_tourist() -> None:
    tourist_skill = compute_skill_score(_tourist_like_insights())
    beginner_skill = compute_skill_score(_active_beginner_insights())
    assert beginner_skill < tourist_skill
    assert beginner_skill < 60


def test_active_beginner_has_higher_momentum_than_tourist() -> None:
    tourist_momentum = compute_momentum_score(_tourist_like_insights())
    beginner_momentum = compute_momentum_score(_active_beginner_insights())
    assert beginner_momentum > tourist_momentum
    assert beginner_momentum >= 75


def test_empty_profile_scores() -> None:
    empty: dict = {
        "current_rating": None,
        "max_rating": None,
        "recent_rating_delta": None,
        "rating_trend": "stable",
        "total_solved": 0,
        "recent_activity": 0,
        "contest_stats": {
            "total_contests": 0,
            "contests_last_30_days": 0,
            "average_rating_change": None,
        },
        "activity_stats": {
            "problems_last_30_days": 0,
            "problems_last_90_days": 0,
            "average_problems_per_week": 0.0,
        },
        "strong_topics": [],
        "weak_topics": [],
    }
    assert compute_skill_score(empty) == 8
    assert compute_momentum_score(empty) == 20
