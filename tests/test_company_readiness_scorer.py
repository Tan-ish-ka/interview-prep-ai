from interview_prep_ai.interview_preparation.company_focus_areas import (
    build_company_area_profile,
)
from interview_prep_ai.interview_preparation.company_readiness_scorer import (
    _area_score,
    _company_level,
    score_company_readiness,
)
from interview_prep_ai.interview_preparation.company_tracks import CompanyTrack, get_company_tracks


def _tourist_insights() -> dict:
    return {
        "current_rating": 3858,
        "total_solved": 1200,
        "recent_activity": 4,
        "skill_score": 100,
        "momentum_score": 32,
        "top_tags": {"dp": 120, "graphs": 90, "math": 40, "greedy": 30},
        "weak_topics": ["geometry"],
        "strong_topics": ["dp", "graphs", "math"],
        "contest_stats": {"total_contests": 120, "contests_last_30_days": 1},
        "activity_stats": {"average_problems_per_week": 0.9},
    }


def _active_beginner_insights() -> dict:
    return {
        "current_rating": 1100,
        "total_solved": 180,
        "recent_activity": 28,
        "skill_score": 31,
        "momentum_score": 87,
        "top_tags": {"greedy": 30, "dp": 8, "graphs": 5},
        "weak_topics": ["dp", "graphs"],
        "strong_topics": ["greedy"],
        "contest_stats": {"total_contests": 18, "contests_last_30_days": 3},
        "activity_stats": {"average_problems_per_week": 5.4},
    }


def _empty_insights() -> dict:
    return {
        "current_rating": None,
        "total_solved": 0,
        "recent_activity": 0,
        "skill_score": 8,
        "momentum_score": 20,
        "top_tags": {},
        "weak_topics": [],
        "strong_topics": [],
        "contest_stats": {"total_contests": 0, "contests_last_30_days": 0},
        "activity_stats": {"average_problems_per_week": 0.0},
    }


def test_company_level_assignment() -> None:
    assert _company_level(80) == "Ready"
    assert _company_level(68) == "Nearly Ready"
    assert _company_level(45) == "Developing"
    assert _company_level(15) == "Early Stage"


def test_area_score_reflects_status() -> None:
    assert _area_score("strong", 20) > _area_score("neutral", 5)
    assert _area_score("neutral", 5) > _area_score("weak", 2)
    assert _area_score("needs_practice", 0) < _area_score("weak", 2)


def test_topic_weighting_changes_company_score() -> None:
    profile = build_company_area_profile(_tourist_insights())
    dp_heavy = CompanyTrack(
        "DP Heavy", "Big Tech", {"Dynamic Programming": 2.0, "Greedy": 0.2}
    )
    greedy_heavy = CompanyTrack(
        "Greedy Heavy", "Big Tech", {"Greedy": 2.0, "Dynamic Programming": 0.2}
    )

    dp_score = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
        area_profile=profile,
        tracks=(dp_heavy,),
        limit=1,
    )[0]["score"]
    greedy_score = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
        area_profile=profile,
        tracks=(greedy_heavy,),
        limit=1,
    )[0]["score"]

    assert dp_score > greedy_score


def test_tourist_has_high_company_scores_despite_low_momentum() -> None:
    rows = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
        limit=10,
    )
    assert len(rows) == 10
    assert rows[0]["score"] >= 70
    assert _tourist_insights()["skill_score"] > _tourist_insights()["momentum_score"]
    assert all("reason" in row for row in rows)
    assert all("strong_topics" in row for row in rows)
    assert all("missing_topics" in row for row in rows)
    assert all("category" in row for row in rows)


def test_active_beginner_scores_lower_than_tourist() -> None:
    tourist_rows = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
        limit=5,
    )
    beginner_rows = score_company_readiness(
        _active_beginner_insights(),
        interview_readiness_level="Developing",
        limit=5,
    )
    assert tourist_rows[0]["score"] > beginner_rows[0]["score"]


def test_empty_profile_returns_low_scores() -> None:
    rows = score_company_readiness(
        _empty_insights(),
        interview_readiness_level="Early Stage",
        limit=5,
    )
    assert all(row["score"] < 45 for row in rows)
    assert all(row["level"] in {"Early Stage", "Developing"} for row in rows)


def test_company_scores_are_separate_from_skill_and_momentum_fields() -> None:
    insights = _tourist_insights()
    rows = score_company_readiness(
        insights,
        interview_readiness_level="Interview Ready",
        limit=3,
    )
    for row in rows:
        assert row["score"] != insights["skill_score"]
        assert row["score"] != insights["momentum_score"]


def test_configurable_company_tracks_include_broad_set() -> None:
    tracks = get_company_tracks()
    names = {track.name for track in tracks}
    expected = {
        "Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber",
        "Airbnb", "LinkedIn", "Dropbox", "Atlassian", "Adobe", "Salesforce",
        "ServiceNow", "Snowflake", "Databricks", "Stripe", "Shopify", "Notion",
        "Jane Street", "Citadel", "Hudson River Trading", "Two Sigma", "DE Shaw",
        "Goldman Sachs", "JPMorgan", "Flipkart", "Meesho", "Razorpay", "CRED",
        "Swiggy", "Zomato", "Groww", "PhonePe",
    }
    assert expected == names
    assert len(tracks) == 34


def test_score_company_readiness_returns_all_companies_by_default() -> None:
    rows = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
    )
    assert len(rows) == 34


def test_company_row_includes_topic_lists() -> None:
    rows = score_company_readiness(
        _tourist_insights(),
        interview_readiness_level="Interview Ready",
        limit=1,
    )
    row = rows[0]
    assert isinstance(row["strong_topics"], list)
    assert isinstance(row["missing_topics"], list)
    assert "DP" in row["strong_topics"] or "Graphs" in row["strong_topics"]
