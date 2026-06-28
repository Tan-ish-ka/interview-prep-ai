from typing import Any
from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine

def score_to_readiness_string(score: int) -> str:
    if score >= 80:
        return "Interview Ready"
    if score >= 60:
        return "Nearly Ready"
    if score >= 40:
        return "Developing"
    return "Early Stage"

class CodeforcesPrepEngine(InterviewPrepEngine):
    pass # Inherit existing deterministic logic for CF

class LeetCodePrepEngine(InterviewPrepEngine):
    def generate(self, insights: dict[str, Any]) -> dict[str, Any]:
        base = super().generate(insights)
        
        # Override readiness level
        ps = insights.get("platform_specific", {})
        ar = ps.get("acceptance_rate", 0)
        streak = ps.get("submission_streak", 0)
        solved = insights.get("total_solved", 0)
        
        # LeetCode heuristic
        readiness = 0
        if solved > 300 and ar > 50:
            readiness = 85
            if streak > 30:
                readiness += 10
        elif solved > 150:
            readiness = 65
        else:
            readiness = min(50, int(solved / 3))
            
        base["interview_readiness_level"] = score_to_readiness_string(min(100, readiness))
        
        return base

class CodeChefPrepEngine(InterviewPrepEngine):
    def generate(self, insights: dict[str, Any]) -> dict[str, Any]:
        base = super().generate(insights)
        
        ps = insights.get("platform_specific", {})
        stars = ps.get("stars", "1★")
        solved = insights.get("total_solved", 0)
        
        readiness = 0
        if "4" in stars or "5" in stars or "6" in stars or "7" in stars:
            readiness = 90
        elif "3" in stars:
            readiness = 70
        elif "2" in stars:
            readiness = 50
        else:
            readiness = 30
            
        base["interview_readiness_level"] = score_to_readiness_string(min(100, readiness))
        
        return base
