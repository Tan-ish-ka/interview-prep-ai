from urllib.parse import urlparse
from datetime import datetime

from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.core.enums import Platform


class LeetCodeAnalyzer(IPlatformAnalyzer):
    def analyze(self, url: str) -> UserProfile:
        """Create a mock LeetCode profile."""
        username = self._extract_username(url)
        
        # Mock data
        mock_top_tags = [
            "array", "string", "hash table", "dynamic programming", 
            "math", "two pointers", "binary search"
        ]
        
        mock_tag_stats = [
            TagStat(tag=tag, solved_count=10 + i*5, attempt_count=0)
            for i, tag in enumerate(mock_top_tags)
        ]
        
        mock_solved_problems = [
            ProblemRecord(
                problem_id=f"leetcode-{i}",
                title=f"LeetCode Problem {i}",
                tags=mock_top_tags[:2],
                solved_at=datetime.now()
            )
            for i in range(200)
        ]
        
        return UserProfile(
            username=username,
            platform=Platform.LEETCODE,
            current_rating=1600,
            max_rating=1850,
            total_solved=200,
            solved_problems=mock_solved_problems,
            tag_stats=mock_tag_stats,
            rating_history={"status": "OK", "result": []}  # Mock rating history
        )
        
    def _extract_username(self, url: str) -> str:
        path = urlparse(url).path.strip("/")
        parts = path.split("/")
        if len(parts) >= 2 and parts[0] == "u":
            return parts[1]
        if len(parts) == 1 and parts[0]:
            return parts[0]
        raise ValueError(f"Cannot extract LeetCode username from URL: {url}")
