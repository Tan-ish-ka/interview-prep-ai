from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine
from interview_prep_ai.interview_preparation.readiness_analyzer import determine_readiness_level
from interview_prep_ai.interview_preparation.topic_mapper import map_interview_focus_areas


def _tourist_insights() -> dict:
    return {
        "current_rating": 3858,
        "max_rating": 3919,
        "recent_rating_delta": 12,
        "rating_trend": "stable",
        "total_solved": 1200,
        "recent_activity": 4,
        "skill_score": 100,
        "momentum_score": 32,
        "top_tags": {"dp": 120, "graphs": 90, "math": 40},
        "weak_topics": ["geometry"],
        "strong_topics": ["dp", "graphs", "math"],
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
    }


def _active_beginner_insights() -> dict:
    return {
        "current_rating": 1100,
        "max_rating": 1250,
        "recent_rating_delta": 45,
        "rating_trend": "improving",
        "total_solved": 180,
        "recent_activity": 28,
        "skill_score": 31,
        "momentum_score": 87,
        "top_tags": {"greedy": 30, "dp": 8, "graphs": 5},
        "weak_topics": ["dp", "graphs"],
        "strong_topics": ["greedy"],
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
    }


def test_tourist_is_interview_ready_with_high_skill_low_momentum() -> None:
    engine = InterviewPrepEngine()
    result = engine.generate(_tourist_insights())

    assert result["interview_readiness_level"] == "Interview Ready"
    assert _tourist_insights()["skill_score"] > _tourist_insights()["momentum_score"]


def test_active_beginner_gets_useful_guidance() -> None:
    engine = InterviewPrepEngine()
    result = engine.generate(_active_beginner_insights())

    assert result["interview_readiness_level"] in {
        "Developing",
        "Nearly Ready",
        "Early Stage",
    }
    assert len(result["roadmap"]) >= 3
    categories = {item["category"] for item in result["roadmap"]}
    assert "weak_topic_practice" in categories


def test_focus_areas_map_cp_tags_to_interview_categories() -> None:
    focus_areas = map_interview_focus_areas(_tourist_insights())
    by_area = {area["area"]: area for area in focus_areas}

    assert by_area["Dynamic Programming"]["status"] == "strong"
    assert by_area["Graphs"]["status"] == "strong"
    assert by_area["Math"]["status"] == "weak"
    assert by_area["Dynamic Programming"]["solved_count"] == 120


def test_roadmap_prioritizes_weak_topics_first() -> None:
    engine = InterviewPrepEngine()
    result = engine.generate(_active_beginner_insights())

    assert result["roadmap"][0]["category"] == "weak_topic_practice"
    assert result["roadmap"][0]["priority"] == 1


def test_roadmap_includes_consistency_when_activity_low() -> None:
    engine = InterviewPrepEngine()
    result = engine.generate(_tourist_insights())

    categories = [item["category"] for item in result["roadmap"]]
    assert "consistency" in categories
    assert "contest_participation" in categories


def test_roadmap_includes_mock_interview_prep() -> None:
    engine = InterviewPrepEngine()
    result = engine.generate(_active_beginner_insights())

    categories = {item["category"] for item in result["roadmap"]}
    assert "mock_interview" in categories
    assert "difficulty_progression" in categories


def test_readiness_is_separate_from_raw_scores() -> None:
    insights = _tourist_insights()
    focus_areas = map_interview_focus_areas(insights)
    level = determine_readiness_level(insights, focus_areas)

    assert level == "Interview Ready"
    assert isinstance(insights["skill_score"], int)
    assert isinstance(insights["momentum_score"], int)
