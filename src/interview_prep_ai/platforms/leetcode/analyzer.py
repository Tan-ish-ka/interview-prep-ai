"""LeetCode profile analyzer."""

from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.api.leetcode_client import LeetCodeClient
from interview_prep_ai.analytics.topic_normalizer import normalize_tag_stats

class LeetCodeAnalyzer(IPlatformAnalyzer):
    def __init__(self, leetcode_client: LeetCodeClient | None = None):
        self._client = leetcode_client or LeetCodeClient()

    def analyze(self, handle: str) -> UserProfile:
        import re
        match = re.search(r"leetcode\.com/(u/)?([^/]+)", handle)
        if match:
            handle = match.group(2)

        data = self._client.get_user_profile(handle)
        matched_user = data.get("matchedUser") or {}
        contest_ranking = data.get("userContestRanking") or {}
        calendar = data.get("userCalendar") or {}
        
        total_solved = 0
        stats = matched_user.get("submitStats", {}).get("acSubmissionNum", [])
        easy_solved = 0
        medium_solved = 0
        hard_solved = 0
        total_ac = 0
        total_submissions = 0
        
        for stat in stats:
            diff = stat.get("difficulty")
            count = stat.get("count", 0)
            if diff == "All":
                total_solved = count
            elif diff == "Easy":
                easy_solved = count
            elif diff == "Medium":
                medium_solved = count
            elif diff == "Hard":
                hard_solved = count
                
        all_stats = matched_user.get("submitStats", {}).get("totalSubmissionNum", [])
        for stat in all_stats:
            if stat.get("difficulty") == "All":
                total_submissions = stat.get("count", 0)
        
        for stat in stats:
            if stat.get("difficulty") == "All":
                total_ac = stat.get("count", 0)
                
        acceptance_rate = round((total_ac / total_submissions * 100) if total_submissions > 0 else 0, 1)

        platform_specific = {
            "easy_solved": easy_solved,
            "medium_solved": medium_solved,
            "hard_solved": hard_solved,
            "acceptance_rate": acceptance_rate,
            "contest_rating": contest_ranking.get("rating"),
            "contest_ranking": contest_ranking.get("globalRanking"),
            "active_days": calendar.get("totalActiveDays"),
            "submission_streak": calendar.get("streak"),
        }

        tag_counts = matched_user.get("tagProblemCounts", {})
        tags = []
        for level in ["advanced", "intermediate", "fundamental"]:
            for item in tag_counts.get(level, []):
                tags.append(TagStat(tag=item["tagName"], solved_count=item["problemsSolved"], attempt_count=0))

        return UserProfile(
            username=handle,
            platform=Platform.LEETCODE,
            current_rating=int(contest_ranking.get("rating", 0)) if contest_ranking.get("rating") else 0, 
            max_rating=int(contest_ranking.get("rating", 0)) if contest_ranking.get("rating") else 0,
            total_solved=total_solved,
            tag_stats=normalize_tag_stats(tags),
            platform_specific=platform_specific
        )
