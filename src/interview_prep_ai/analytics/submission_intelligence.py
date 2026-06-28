from collections import defaultdict
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.submission import SubmissionRecord

class SubmissionIntelligenceEngine:
    """Computes basic statistics about submission failures."""

    @staticmethod
    def analyze(profile: UserProfile) -> dict:
        submissions = profile.all_submissions
        if not submissions:
            return {
                "total_submissions": 0,
                "verdict_counts": {},
                "verdict_rates": {},
                "average_attempts_before_ac": 0.0,
            }
            
        verdict_counts: dict[str, int] = defaultdict(int)
        attempts_per_problem: dict[str, int] = defaultdict(int)
        solved_problems_set: set[str] = set()

        for sub in submissions:
            verdict_counts[sub.verdict] += 1
            prob_id = sub.problem.problem_id
            if sub.verdict == "OK":
                if prob_id not in solved_problems_set:
                    solved_problems_set.add(prob_id)
                    attempts_per_problem[prob_id] += 1
            else:
                if prob_id not in solved_problems_set:
                    attempts_per_problem[prob_id] += 1

        total_submissions = len(submissions)
        verdict_rates = {
            verdict: round((count / total_submissions) * 100, 2)
            for verdict, count in verdict_counts.items()
        }

        # Average attempts before AC (only for problems that were eventually solved)
        total_ac_attempts = sum(attempts_per_problem[pid] for pid in solved_problems_set)
        average_attempts = round(total_ac_attempts / max(1, len(solved_problems_set)), 2)

        return {
            "total_submissions": total_submissions,
            "verdict_counts": dict(verdict_counts),
            "verdict_rates": verdict_rates,
            "average_attempts_before_ac": average_attempts,
        }
