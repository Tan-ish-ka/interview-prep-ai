from interview_prep_ai.analytics.analyzers.base_analyzer import BaseAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.analytics.insight_scorer import compute_skill_score, compute_momentum_score
from interview_prep_ai.analytics.potential_efficiency_analyzer import compute_potential_efficiency

class CodeChefAnalyzer(BaseAnalyzer):
    def generate(self, profile: UserProfile, rating_history: dict) -> dict:
        insights = {
            "current_rating": profile.current_rating or 0,
            "max_rating": profile.max_rating or 0,
            "rating_delta": 0,
            "recent_rating_delta": 0,
            "rating_trend": "stable",
            "contest_stats": {
                "total_contests": 0,
                "best_rank": profile.platform_specific.get("global_rank", 0)
            },
            "activity_stats": {},
            "total_solved": profile.total_solved,
            "solved_count_definition": "Problems solved",
            "recent_activity": 0,
            "top_tags": {},
            "tag_frequency": {},
            "weak_topics": [],
            "strong_topics": [],
            "platform_specific": profile.platform_specific
        }
        
        insights["skill_score"] = compute_skill_score(insights)
        insights["momentum_score"] = compute_momentum_score(insights)
        insights["potential_efficiency"] = compute_potential_efficiency(insights)
        
        insights["ai_insight"] = {
            "summary": "CodeChef profile analyzed.",
            "strengths": "Competitive Programming",
            "growth_opportunity": "Consistency",
            "recommendation": "Participate in more rated contests.",
            "readiness_score": min(100, int((profile.current_rating or 0) / 30))
        }

        return insights
