from typing import Any
from interview_prep_ai.core.models.profile import UserProfile

class RootCauseEngine:
    """Infers root causes behind failed submissions based on frequency and patterns."""

    @staticmethod
    def infer(profile: UserProfile, submission_intelligence: dict[str, Any]) -> list[dict[str, Any]]:
        causes: list[dict[str, Any]] = []
        rates = submission_intelligence.get("verdict_rates", {})
        counts = submission_intelligence.get("verdict_counts", {})
        total = submission_intelligence.get("total_submissions", 0)

        if total < 10:
            return causes  # Not enough data to infer confidently

        # 1. Compilation Errors (CE)
        ce_rate = rates.get("COMPILATION_ERROR", 0)
        if ce_rate > 10:
            confidence = min(95.0, 50.0 + (ce_rate - 10) * 2)
            causes.append({
                "issue": "Compilation Errors",
                "inferred_cause": "Weak syntax knowledge or template errors",
                "recommendation": "Spend more time implementing problems from scratch without copying templates.",
                "confidence_score": round(confidence, 1),
                "data_points": [f"CE rate is {ce_rate}% (count: {counts.get('COMPILATION_ERROR', 0)})"]
            })

        # 2. Time Limit Exceeded (TLE)
        tle_rate = rates.get("TIME_LIMIT_EXCEEDED", 0)
        if tle_rate > 15:
            confidence = min(95.0, 60.0 + (tle_rate - 15) * 1.5)
            causes.append({
                "issue": "Time Limit Exceeded",
                "inferred_cause": "Inefficient algorithm choice or brute-force implementations",
                "recommendation": "Study time complexities and identify optimal algorithms (e.g., Binary Search, DP) before coding.",
                "confidence_score": round(confidence, 1),
                "data_points": [f"TLE rate is {tle_rate}% (count: {counts.get('TIME_LIMIT_EXCEEDED', 0)})"]
            })

        # 3. Runtime Error (RE)
        re_rate = rates.get("RUNTIME_ERROR", 0)
        if re_rate > 8:
            confidence = min(90.0, 50.0 + (re_rate - 8) * 3)
            causes.append({
                "issue": "Runtime Errors",
                "inferred_cause": "Out-of-bounds array access, null pointers, or integer overflow",
                "recommendation": "Practice defensive programming and boundary testing before submission.",
                "confidence_score": round(confidence, 1),
                "data_points": [f"RE rate is {re_rate}% (count: {counts.get('RUNTIME_ERROR', 0)})"]
            })

        # 4. Wrong Answer (WA)
        wa_rate = rates.get("WRONG_ANSWER", 0)
        if wa_rate > 40:
            confidence = min(95.0, 60.0 + (wa_rate - 40))
            causes.append({
                "issue": "Frequent Wrong Answers",
                "inferred_cause": "Missed corner cases or incorrect greedy assumptions",
                "recommendation": "Practice dry-running your code and writing custom edge cases.",
                "confidence_score": round(confidence, 1),
                "data_points": [f"WA rate is {wa_rate}% (count: {counts.get('WRONG_ANSWER', 0)})"]
            })

        # 5. Multiple Attempts
        avg_attempts = submission_intelligence.get("average_attempts_before_ac", 1.0)
        if avg_attempts > 2.5:
            confidence = min(90.0, 50.0 + (avg_attempts - 2.5) * 15)
            causes.append({
                "issue": "High Retry Rate",
                "inferred_cause": "Submitting before thoroughly verifying the logic",
                "recommendation": "Spend 5-10 extra minutes verifying your approach on paper before writing code.",
                "confidence_score": round(confidence, 1),
                "data_points": [f"Average attempts before AC is {avg_attempts}"]
            })

        # Sort by confidence
        causes.sort(key=lambda x: x["confidence_score"], reverse=True)
        return causes
