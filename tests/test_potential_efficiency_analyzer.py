from interview_prep_ai.analytics.potential_efficiency_analyzer import (
    _efficiency_score,
    compute_potential_efficiency,
)


def _base_insights(**overrides) -> dict:
    base = {
        "current_rating": 1600,
        "max_rating": 1650,
        "rating_delta": 50,
        "recent_rating_delta": 20,
        "rating_trend": "improving",
        "total_solved": 200,
        "recent_activity": 18,
        "skill_score": 55,
        "momentum_score": 62,
        "weak_topics": ["graphs"],
        "strong_topics": ["dp", "greedy"],
        "contest_stats": {"total_contests": 25, "contests_last_30_days": 2},
        "activity_stats": {
            "problems_last_30_days": 18,
            "problems_last_90_days": 45,
            "average_problems_per_week": 5.0,
        },
    }
    base.update(overrides)
    return base


def test_efficient_user_scores_higher_than_grindy_peer() -> None:
    efficient = _efficiency_score(
        _base_insights(current_rating=1600, total_solved=120, total_contests=20)
    )
    grindy = _efficiency_score(
        _base_insights(current_rating=1600, total_solved=500, total_contests=20)
    )
    assert efficient > grindy


def test_efficiency_separate_from_skill_and_momentum() -> None:
    result = compute_potential_efficiency(_base_insights())
    assert result["efficiency_score"] != _base_insights()["skill_score"]
    assert result["efficiency_score"] != _base_insights()["momentum_score"]


def test_low_activity_marks_needs_more_consistency() -> None:
    result = compute_potential_efficiency(
        _base_insights(
            recent_activity=3,
            momentum_score=30,
            activity_stats={
                "problems_last_30_days": 3,
                "problems_last_90_days": 8,
                "average_problems_per_week": 2.0,
            },
        )
    )
    assert result["growth_potential"] == "Needs more consistency"


def test_high_efficiency_and_improving_trend_can_be_high_potential() -> None:
    result = compute_potential_efficiency(
        _base_insights(
            current_rating=2100,
            total_solved=180,
            rating_trend="improving",
            recent_rating_delta=35,
            recent_activity=20,
            momentum_score=70,
        )
    )
    assert result["growth_potential"] == "High potential"


def test_empty_like_profile_returns_guidance() -> None:
    result = compute_potential_efficiency(
        {
            "current_rating": None,
            "rating_delta": None,
            "recent_rating_delta": None,
            "rating_trend": "stable",
            "total_solved": 0,
            "recent_activity": 0,
            "skill_score": 8,
            "momentum_score": 20,
            "weak_topics": [],
            "strong_topics": [],
            "contest_stats": {"total_contests": 0, "contests_last_30_days": 0},
            "activity_stats": {
                "problems_last_30_days": 0,
                "problems_last_90_days": 0,
                "average_problems_per_week": 0.0,
            },
        }
    )
    assert result["efficiency_score"] == 25
    assert result["guidance"]["why_this_score"]
    assert result["guidance"]["what_to_improve_next"]
    assert result["guidance"]["confidence_builders"]
