from typing import Any
from interview_prep_ai.core.models.profile import UserProfile

class HiddenPotentialEngine:
    """Calculates the gap between current rating and potential true rating."""

    @staticmethod
    def calculate(profile: UserProfile, insights: dict[str, Any], submission_intel: dict[str, Any]) -> dict[str, Any]:
        current_rating = profile.current_rating or 1200
        total_solved = profile.total_solved
        avg_attempts = submission_intel.get("average_attempts_before_ac", 1.0)
        ok_rate = submission_intel.get("verdict_rates", {}).get("OK", 0)
        contest_stats = insights.get("contest_stats", {})
        
        # Calculate base potential based on raw problem volume
        # Rough heuristic: solving 500 problems typically correlates to ~1600 rating
        volume_potential = 1200 + (total_solved * 1.5)
        
        # Adjust for accuracy
        accuracy_multiplier = 1.0
        if ok_rate > 50:
            accuracy_multiplier = 1.05 + ((ok_rate - 50) / 100)
        elif ok_rate < 30:
            accuracy_multiplier = 0.9
            
        # Adjust for efficiency
        efficiency_multiplier = 1.0
        if avg_attempts <= 1.5:
            efficiency_multiplier = 1.1
        elif avg_attempts >= 3.0:
            efficiency_multiplier = 0.95
            
        potential_rating = min(3500, int(volume_potential * accuracy_multiplier * efficiency_multiplier))
        
        # Constrain potential rating so it doesn't drop below current rating
        potential_rating = max(current_rating, potential_rating)
        
        gap = potential_rating - current_rating
        
        reasons = []
        if gap > 200:
            if contest_stats.get("total_contests", 0) < 5:
                reasons.append("You have excellent practice volume but lack contest frequency to reflect your true rating.")
            if ok_rate > 50:
                reasons.append(f"Your accuracy rate of {ok_rate}% is extremely high for your current rating bracket.")
            if avg_attempts <= 1.5:
                reasons.append("Your low attempt-before-AC ratio suggests you solve problems flawlessly on the first try.")
        elif gap < 50:
            reasons.append("Your current rating perfectly matches your practice volume and accuracy.")
            
        if not reasons:
            reasons.append("Your potential is climbing steadily as you accumulate more solved problems.")
            
        return {
            "current_rating": current_rating,
            "potential_rating": potential_rating,
            "gap": gap,
            "reasons": reasons,
            "confidence_score": 85 if total_solved > 100 else 60
        }
