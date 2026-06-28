from typing import Any
from collections import defaultdict
from interview_prep_ai.core.models.profile import UserProfile

class ContestReplayAnalyzer:
    """Reconstructs contests chronologically to find poor decision making."""

    @staticmethod
    def analyze(profile: UserProfile) -> list[dict[str, Any]]:
        # Group submissions by contest
        # We assume the problem ID starts with the contest ID, e.g., "1234A" -> contest_id "1234"
        contest_submissions = defaultdict(list)
        for sub in profile.all_submissions:
            if sub.participant_type in ["CONTESTANT", "OUT_OF_COMPETITION", "VIRTUAL"]:
                # Extract contest ID from problem.problem_id (e.g. '1234A')
                import re
                match = re.match(r"^(\d+)", sub.problem.problem_id)
                if match:
                    contest_id = match.group(1)
                    contest_submissions[contest_id].append(sub)

        replays = []
        
        # Analyze each contest
        for contest_id, subs in contest_submissions.items():
            if not subs:
                continue
                
            # Sort chronologically by relative time
            subs.sort(key=lambda x: x.relative_time_seconds)
            
            timeline = []
            problems_attempted = set()
            problems_solved = set()
            total_penalty_time = 0
            
            # Map problem to its attempts
            attempts_by_prob = defaultdict(list)
            
            for sub in subs:
                prob_idx = sub.problem.problem_id.replace(contest_id, "")
                problems_attempted.add(prob_idx)
                attempts_by_prob[prob_idx].append(sub)
                
                minutes_in = sub.relative_time_seconds // 60
                
                if sub.verdict == "OK":
                    if prob_idx not in problems_solved:
                        problems_solved.add(prob_idx)
                        penalty = minutes_in + (len(attempts_by_prob[prob_idx]) - 1) * 20
                        total_penalty_time += penalty
                        
                        timeline.append({
                            "time_minutes": minutes_in,
                            "event": "AC",
                            "problem": prob_idx,
                            "description": f"Solved Problem {prob_idx} in {minutes_in}m with {len(attempts_by_prob[prob_idx]) - 1} penalty(ies)."
                        })
                else:
                    if prob_idx not in problems_solved:
                         timeline.append({
                            "time_minutes": minutes_in,
                            "event": "WA",
                            "problem": prob_idx,
                            "description": f"Failed attempt on Problem {prob_idx} ({sub.verdict})."
                        })
            
            # Look for time-wasting behavior (spending > 40 minutes without AC)
            time_wasted_minutes = 0
            for prob_idx, attempts in attempts_by_prob.items():
                if prob_idx not in problems_solved and len(attempts) > 2:
                    first_attempt = attempts[0].relative_time_seconds // 60
                    last_attempt = attempts[-1].relative_time_seconds // 60
                    if (last_attempt - first_attempt) > 40:
                        time_wasted_minutes += (last_attempt - first_attempt)
                        timeline.append({
                            "time_minutes": last_attempt,
                            "event": "TIME_WASTED",
                            "problem": prob_idx,
                            "description": f"Spent over {last_attempt - first_attempt} minutes stuck on {prob_idx} without success."
                        })
            
            replays.append({
                "contest_id": contest_id,
                "problems_attempted": len(problems_attempted),
                "problems_solved": len(problems_solved),
                "total_penalty_time": total_penalty_time,
                "time_wasted_minutes": time_wasted_minutes,
                "timeline": timeline,
                "date": subs[0].submitted_at.isoformat() if subs[0].submitted_at else ""
            })
            
        # Return the 5 most recent contests with substantial activity
        replays.sort(key=lambda x: x["date"], reverse=True)
        return [r for r in replays if r["problems_attempted"] > 0][:5]
