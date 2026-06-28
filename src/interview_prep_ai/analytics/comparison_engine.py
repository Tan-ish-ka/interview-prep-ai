"""Comparison engine for two UserProfile objects."""

from __future__ import annotations

from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.analytics.analyzers.codeforces_analyzer import CodeforcesAnalyzer
from interview_prep_ai.interview_preparation.platform_prep_engines import CodeforcesPrepEngine


def compare_profiles(
    profile_a: UserProfile,
    profile_b: UserProfile,
) -> dict:
    """Generate comparison insights between two profiles."""
    generator = CodeforcesAnalyzer()
    insights_a = generator.generate(profile_a, profile_a.rating_history)
    insights_b = generator.generate(profile_b, profile_b.rating_history)

    # Interview prep
    interview_engine = CodeforcesPrepEngine()
    interview_a = interview_engine.generate(insights_a)
    interview_b = interview_engine.generate(insights_b)

    # --- Metric Comparison ---
    metrics = [
        "current_rating",
        "max_rating",
        "total_solved",
        "skill_score",
        "momentum_score",
    ]
    metric_comparison = {}
    for metric in metrics:
        val_a = insights_a.get(metric, 0) if insights_a.get(metric) is not None else 0
        val_b = insights_b.get(metric, 0) if insights_b.get(metric) is not None else 0
        
        if isinstance(val_a, int) and isinstance(val_b, int):
            difference = val_b - val_a
            if val_a != 0:
                percentage_gap = ((val_b - val_a) / val_a) * 100
            else:
                percentage_gap = 100.0 if val_b > 0 else 0.0
            
            metric_comparison[metric] = {
                "value_a": val_a,
                "value_b": val_b,
                "difference": difference,
                "percentage_gap": round(percentage_gap, 1),
                "winner": "profile_b" if val_b > val_a else "profile_a" if val_a > val_b else "tie",
            }
        else:
            metric_comparison[metric] = {
                "value_a": val_a,
                "value_b": val_b,
                "difference": None,
                "percentage_gap": None,
                "winner": "tie",
            }
    
    # Add contest stats comparison
    contest_stats_a = insights_a.get("contest_stats", {})
    contest_stats_b = insights_b.get("contest_stats", {})
    total_contests_a = contest_stats_a.get("total_contests", 0)
    total_contests_b = contest_stats_b.get("total_contests", 0)
    metric_comparison["total_contests"] = {
        "value_a": total_contests_a,
        "value_b": total_contests_b,
        "difference": total_contests_b - total_contests_a,
        "percentage_gap": round(((total_contests_b - total_contests_a) / total_contests_a) * 100, 1) if total_contests_a > 0 else None,
        "winner": "profile_b" if total_contests_b > total_contests_a else "profile_a" if total_contests_a > total_contests_b else "tie",
    }
    
    # Add efficiency, growth, interview readiness
    efficiency_a = insights_a.get("potential_efficiency", {}).get("efficiency_score", 0)
    efficiency_b = insights_b.get("potential_efficiency", {}).get("efficiency_score", 0)
    metric_comparison["efficiency_score"] = {
        "value_a": efficiency_a,
        "value_b": efficiency_b,
        "difference": efficiency_b - efficiency_a,
        "percentage_gap": round(((efficiency_b - efficiency_a) / efficiency_a) * 100, 1) if efficiency_a > 0 else None,
        "winner": "profile_b" if efficiency_b > efficiency_a else "profile_a" if efficiency_a > efficiency_b else "tie",
    }
    growth_a = insights_a.get("potential_efficiency", {}).get("growth_potential", "")
    growth_b = insights_b.get("potential_efficiency", {}).get("growth_potential", "")
    metric_comparison["growth_potential"] = {
        "value_a": growth_a,
        "value_b": growth_b,
    }

    # Interview readiness
    readiness_a = interview_a.get("interview_readiness_level", "")
    readiness_b = interview_b.get("interview_readiness_level", "")
    # Assign numerical values to readiness levels for comparison
    readiness_order = {"Early": 0, "Developing": 1, "Nearly Ready": 2, "Ready": 3}
    readiness_num_a = readiness_order.get(readiness_a, -1)
    readiness_num_b = readiness_order.get(readiness_b, -1)
    metric_comparison["interview_readiness"] = {
        "value_a": readiness_a,
        "value_b": readiness_b,
        "winner": "profile_b" if readiness_num_b > readiness_num_a else "profile_a" if readiness_num_a > readiness_num_b else "tie",
    }

    # --- Head-to-Head Summary ---
    # Simple winner logic for skill, consistency, activity
    skill_winner = metric_comparison["skill_score"]["winner"]
    consistency_winner = metric_comparison["total_contests"]["winner"]  # Using contest count as consistency proxy
    activity_winner = "profile_a" if insights_a.get("activity_stats", {}).get("problems_last_30_days", 0) > insights_b.get("activity_stats", {}).get("problems_last_30_days", 0) else "profile_b"
    # Generate dynamic summary
    def get_summary():
        parts = []
        if skill_winner == "profile_b":
            parts.append(f"{profile_b.username} demonstrates stronger overall problem-solving ability.")
        else:
            parts.append(f"{profile_a.username} demonstrates stronger overall problem-solving ability.")
        if consistency_winner == "profile_a":
            parts.append(f"{profile_a.username} shows better consistency and contest participation.")
        else:
            parts.append(f"{profile_b.username} shows better consistency and contest participation.")
        return " ".join(parts)
    head_to_head = {
        "skill": skill_winner,
        "consistency": consistency_winner,
        "activity": activity_winner,
        "summary": get_summary(),
    }

    # --- Topic Battle ---
    # Convert tag stats to dictionaries for easier comparison
    tag_stats_a = {t.tag: t.solved_count for t in profile_a.tag_stats}
    tag_stats_b = {t.tag: t.solved_count for t in profile_b.tag_stats}
    all_tags = set(tag_stats_a.keys()).union(set(tag_stats_b.keys()))
    topic_comparison = []
    for tag in sorted(all_tags):
        count_a = tag_stats_a.get(tag, 0)
        count_b = tag_stats_b.get(tag, 0)
        topic_comparison.append({
            "topic": tag,
            "count_a": count_a,
            "count_b": count_b,
            "winner": "profile_b" if count_b > count_a else "profile_a" if count_a > count_b else "tie",
        })
    # Get strong/weak topics from insights
    strong_a = set(insights_a.get("strong_topics", []))
    strong_b = set(insights_b.get("strong_topics", []))
    weak_a = set(insights_a.get("weak_topics", []))
    weak_b = set(insights_b.get("weak_topics", []))
    topic_summary = {
        "stronger_for_a": list(strong_a - strong_b),
        "stronger_for_b": list(strong_b - strong_a),
        "mutual_weaknesses": list(weak_a.intersection(weak_b)),
        "missing_in_a": list(strong_b - strong_a),
        "missing_in_b": list(strong_a - strong_b),
    }

    # --- Improvement Insights ---
    improvement_areas = []
    # Check topics where B is stronger
    for topic in topic_summary.get("missing_in_a", []):
        improvement_areas.append({
            "type": "topic",
            "name": topic,
            "reason": f"{profile_b.username} is strong in {topic}",
        })
    # Check metrics
    for metric in ["current_rating", "skill_score", "momentum_score"]:
        if metric_comparison[metric]["winner"] == "profile_b":
            improvement_areas.append({
                "type": "metric",
                "name": metric.replace("_", " ").title(),
                "reason": f"{profile_b.username} has a higher {metric.replace('_', ' ')}",
            })
    # Check contest count
    if metric_comparison["total_contests"]["winner"] == "profile_b":
        improvement_areas.append({
            "type": "activity",
            "name": "Contest Frequency",
            "reason": f"{profile_b.username} participates in more contests",
        })
    # Estimate skill score improvement (very rough, but good for demonstration)
    if metric_comparison["skill_score"]["winner"] == "profile_b":
        estimated_improvement = metric_comparison["skill_score"]["percentage_gap"]
    else:
        estimated_improvement = 0.0

    improvement_insights = {
        "improvement_areas": improvement_areas[:5],  # Top 5
        "estimated_skill_score_improvement": estimated_improvement,
    }

    return {
        "profile_a": {"username": profile_a.username, "insights": insights_a, "interview": interview_a},
        "profile_b": {"username": profile_b.username, "insights": insights_b, "interview": interview_b},
        "head_to_head": head_to_head,
        "metric_comparison": metric_comparison,
        "topic_comparison": topic_comparison,
        "topic_summary": topic_summary,
        "improvement_insights": improvement_insights,
    }
