from interview_prep_ai.analytics.analyzers.base_analyzer import BaseAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.analytics.topic_normalizer import normalize_tag_frequency, normalize_topics
from interview_prep_ai.analytics.insight_scorer import compute_skill_score, compute_momentum_score
from interview_prep_ai.analytics.potential_efficiency_analyzer import compute_potential_efficiency

class LeetCodeAnalyzer(BaseAnalyzer):
    def generate(self, profile: UserProfile, rating_history: dict) -> dict:
        tag_frequency = {}
        for tag_stat in profile.tag_stats:
            tag_frequency[tag_stat.tag] = tag_stat.solved_count
            
        strong_topics = [t for t, count in sorted(tag_frequency.items(), key=lambda x: -x[1]) if count >= 5][:3]
        weak_topics = [t for t, count in sorted(tag_frequency.items(), key=lambda x: (x[1], x[0])) if t not in set(strong_topics)][:5]

        tag_frequency = normalize_tag_frequency(tag_frequency)
        top_tags = dict(list(tag_frequency.items())[:5])
        strong_topics = normalize_topics(strong_topics)
        weak_topics = normalize_topics(weak_topics)

        insights = {
            "current_rating": profile.current_rating or 0,
            "max_rating": profile.max_rating or 0,
            "rating_delta": 0,
            "recent_rating_delta": 0,
            "rating_trend": "stable",
            "contest_stats": {
                "total_contests": 0,
                "best_rank": profile.platform_specific.get("contest_ranking", 0)
            },
            "activity_stats": {
                "active_days": profile.platform_specific.get("active_days", 0),
                "streak": profile.platform_specific.get("submission_streak", 0)
            },
            "total_solved": profile.total_solved,
            "solved_count_definition": "Problems solved across all difficulties",
            "recent_activity": 0,
            "top_tags": top_tags,
            "tag_frequency": tag_frequency,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "platform_specific": profile.platform_specific
        }
        
        insights["skill_score"] = compute_skill_score(insights)
        insights["momentum_score"] = compute_momentum_score(insights)
        insights["potential_efficiency"] = compute_potential_efficiency(insights)
        
        # We will handle AI insights inside the generic Prep Engine or in the endpoint. 
        # The AI insight generator normally attaches it to `insights["ai_insight"]`.
        insights["ai_insight"] = {
            "summary": "LeetCode profile analyzed.",
            "strengths": ", ".join(strong_topics),
            "growth_opportunity": ", ".join(weak_topics),
            "recommendation": "Keep solving problems to improve your acceptance rate and contest rating.",
            "readiness_score": min(100, int((profile.platform_specific.get("acceptance_rate", 0) + (profile.total_solved / 10)) / 2))
        }

        return insights
