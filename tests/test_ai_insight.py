from interview_prep_ai.analytics.ai_insight import generate_ai_insight


def test_ai_insight_fields_and_readiness():
    insights = {
        "current_rating": 1500,
        "max_rating": 1600,
        "total_solved": 420,
        "contest_stats": {"contests_last_30_days": 0},
        "recent_activity": 4,
        "strong_topics": ["strings"],
        "weak_topics": ["graphs", "bitmasks"],
        "skill_score": 50,
        "momentum_score": 20,
    }

    out = generate_ai_insight(insights)
    assert isinstance(out, dict)
    assert "summary" in out and isinstance(out["summary"], str)
    assert "strengths" in out and isinstance(out["strengths"], str)
    assert "growth_opportunity" in out and isinstance(out["growth_opportunity"], str)
    assert "recommendation" in out and isinstance(out["recommendation"], str)
    assert "readiness_score" in out and isinstance(out["readiness_score"], int)
    assert 0 <= out["readiness_score"] <= 100


def test_no_hidden_or_unmapped_tags_leak():
    insights = {
        "current_rating": 1200,
        "total_solved": 150,
        "contest_stats": {"contests_last_30_days": 1},
        "recent_activity": 8,
        # include a noisy/unmapped tag and a mapped one
        "strong_topics": ["broken", "dp"],
        "weak_topics": ["schedules", "binary search"],
    }

    out = generate_ai_insight(insights)
    # 'dp' should map to Dynamic Programming via topic_mapper; 'broken' and 'schedules' should be skipped
    assert "Dynamic Programming" in out["strengths"] or "DP" in out["strengths"] or "dp" in out["strengths"].lower()
    # ensure 'broken' and 'schedules' do not appear in the generated strings
    combined = " ".join([out["summary"], out["strengths"], out["growth_opportunity"], out["recommendation"]]).lower()
    assert "broken" not in combined
    assert "schedules" not in combined


def test_length_constraint():
    insights = {
        "current_rating": 2000,
        "total_solved": 3500,
        "contest_stats": {"contests_last_30_days": 5},
        "recent_activity": 40,
        "strong_topics": ["dp", "graphs", "greedy", "strings"],
        "weak_topics": [],
    }

    out = generate_ai_insight(insights)
    combined = " ".join([out["summary"], out["strengths"], out["growth_opportunity"], out["recommendation"]])
    assert len(combined.split()) <= 120
