from typing import Any
from interview_prep_ai.core.models.profile import UserProfile

class LearningDNAEngine:
    """Infers the user's learning style based on submission and analytics data."""

    @staticmethod
    def infer(profile: UserProfile, insights: dict[str, Any], submission_intel: dict[str, Any]) -> dict[str, Any]:
        dna_traits: list[dict[str, Any]] = []
        
        total_submissions = submission_intel.get("total_submissions", 0)
        verdict_rates = submission_intel.get("verdict_rates", {})
        avg_attempts = submission_intel.get("average_attempts_before_ac", 1.0)
        activity_stats = insights.get("activity_stats", {})
        contest_stats = insights.get("contest_stats", {})

        # 1. Consistent Learner vs Sprint Learner
        problems_per_week = activity_stats.get("average_problems_per_week", 0)
        problems_last_90 = activity_stats.get("problems_last_90_days", 0)
        
        if problems_per_week >= 5 and problems_last_90 >= 30:
            dna_traits.append({
                "trait": "Consistent Learner",
                "description": "You maintain a steady pace of learning over long periods, which compounds effectively.",
                "type": "strength",
                "confidence_score": 90,
                "reason": f"Averaging {problems_per_week:.1f} problems/week consistently."
            })
        elif problems_last_90 > 50 and problems_per_week < 2:
            dna_traits.append({
                "trait": "Sprint Learner",
                "description": "You learn in intense bursts rather than a steady daily pace.",
                "type": "neutral",
                "confidence_score": 85,
                "reason": "High recent activity but low long-term weekly average."
            })

        # 2. Implementation Specialist vs Theory Learner
        wa_rate = verdict_rates.get("WRONG_ANSWER", 0)
        re_rate = verdict_rates.get("RUNTIME_ERROR", 0)
        ce_rate = verdict_rates.get("COMPILATION_ERROR", 0)
        tle_rate = verdict_rates.get("TIME_LIMIT_EXCEEDED", 0)
        
        implementation_issues = wa_rate + re_rate + ce_rate
        if implementation_issues < 25 and total_submissions > 50:
            dna_traits.append({
                "trait": "Implementation Specialist",
                "description": "You translate logic to code flawlessly with minimal bugs or syntax errors.",
                "type": "strength",
                "confidence_score": 88,
                "reason": f"Combined implementation error rate is incredibly low ({implementation_issues:.1f}%)."
            })
        elif implementation_issues > 50:
            dna_traits.append({
                "trait": "Theory-First Learner",
                "description": "You likely understand the algorithmic concepts but struggle translating them into bug-free code quickly.",
                "type": "weakness",
                "confidence_score": 82,
                "reason": f"High rate of implementation-related verdicts ({implementation_issues:.1f}%)."
            })

        # 3. Contest Specialist vs Practice Specialist
        contests_30_days = contest_stats.get("contests_last_30_days", 0)
        if contests_30_days >= 3:
            dna_traits.append({
                "trait": "Contest Specialist",
                "description": "You thrive under pressure and regularly participate in live competitions.",
                "type": "strength",
                "confidence_score": 95,
                "reason": f"Participated in {contests_30_days} contests in the last 30 days."
            })
        elif total_submissions > 100 and contests_30_days == 0:
            dna_traits.append({
                "trait": "Practice Specialist",
                "description": "You prefer a stress-free environment to master concepts at your own pace.",
                "type": "neutral",
                "confidence_score": 80,
                "reason": "High submission volume but zero recent contest participation."
            })

        # 4. Perfectionist vs Risk Taker
        if avg_attempts <= 1.2 and total_submissions > 50:
            dna_traits.append({
                "trait": "Perfectionist",
                "description": "You rarely submit unless you are absolutely certain your code is correct.",
                "type": "strength",
                "confidence_score": 85,
                "reason": f"Averaging only {avg_attempts} attempts before AC."
            })
        elif avg_attempts >= 3.0:
            dna_traits.append({
                "trait": "Risk Taker",
                "description": "You prefer to test your logic by submitting and iterating based on the verdict.",
                "type": "neutral",
                "confidence_score": 85,
                "reason": f"Averaging {avg_attempts} attempts before AC."
            })
            
        if not dna_traits:
             dna_traits.append({
                "trait": "Adaptive Learner",
                "description": "You have a balanced learning profile with no extreme outliers in behavior.",
                "type": "neutral",
                "confidence_score": 75,
                "reason": "Metrics are balanced across all dimensions."
            })

        return {
            "dna_traits": sorted(dna_traits, key=lambda x: x["confidence_score"], reverse=True)
        }
