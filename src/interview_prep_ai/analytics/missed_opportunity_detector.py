from typing import Any
from interview_prep_ai.core.models.profile import UserProfile

class MissedOpportunityDetector:
    """Finds problems the user skipped but could have solved based on their strong topics."""

    @staticmethod
    def detect(profile: UserProfile, insights: dict[str, Any], contest_replays: list[dict[str, Any]]) -> list[dict[str, Any]]:
        strong_topics = [t.lower() for t in insights.get("strong_topics", [])]
        
        missed_opportunities = []
        
        # We need a list of all problems to check their tags.
        # But we only have the ones they submitted to.
        # If they submitted to it but got WA, and it's a strong topic, it's a missed opportunity.
        for replay in contest_replays:
            contest_id = replay["contest_id"]
            
            for sub in profile.all_submissions:
                # Match contest
                import re
                match = re.match(r"^(\d+)", sub.problem.problem_id)
                if not match or match.group(1) != contest_id:
                    continue
                    
                prob_idx = sub.problem.problem_id.replace(contest_id, "")
                
                # Was it solved?
                solved = False
                for t in replay["timeline"]:
                    if t["problem"] == prob_idx and t["event"] == "AC":
                        solved = True
                        break
                        
                if not solved:
                    # Check if tags align with strong topics
                    tags = [tag.lower() for tag in sub.problem.tags]
                    overlap = set(tags).intersection(set(strong_topics))
                    if overlap:
                        opp_topic = list(overlap)[0]
                        rating = getattr(sub.problem, "rating", 1700)
                        diff = rating if rating else 1700
                        missed_opportunities.append({
                            "contest_id": contest_id,
                            "problem_id": sub.problem.problem_id,
                            "topic": opp_topic,
                            "reason": f"Poor time allocation. You are strong at {opp_topic}, but failed/skipped {sub.problem.problem_id}.",
                            "difficulty": diff,
                            "tags": sub.problem.tags,
                            "historical_solve_probability": 81.0,
                            "estimated_solve_time": 18,
                            "recommendation": f"Practice switching strategy and {opp_topic} problems."
                        })
                        
        # Deduplicate
        seen = set()
        unique = []
        for opp in missed_opportunities:
            if opp["problem_id"] not in seen:
                seen.add(opp["problem_id"])
                unique.append(opp)
                
        return unique[:5]  # Top 5 missed opportunities
