from urllib.parse import urlparse
from datetime import datetime

from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.core.enums import Platform


class CodeChefAnalyzer(IPlatformAnalyzer):
    def analyze(self, url: str) -> UserProfile:
        """Create a mock CodeChef profile."""
        username = self._extract_username(url)
        
        # Mock data
        mock_top_tags = [
            "math", "ad-hoc", "dynamic programming", "graphs", 
            "greedy", "data structures", "strings"
        ]
        
        mock_tag_stats = [
            TagStat(tag=tag, solved_count=8 + i*4, attempt_count=0)
            for i, tag in enumerate(mock_top_tags)
        ]
        
        mock_solved_problems = [
            ProblemRecord(
                problem_id=f"codechef-{i}",
                title=f"CodeChef Problem {i}",
                tags=mock_top_tags[:2],
                solved_at=datetime.now()
            )
            for i in range(150)
        ]
        
        return UserProfile(
            username=username,
            platform=Platform.CODECHEF,
            current_rating=1800,
            max_rating=2000,
            total_solved=150,
            solved_problems=mock_solved_problems,
            tag_stats=mock_tag_stats,
            rating_history={"status": "OK", "result": []}  # Mock rating history
        )
        
    def _extract_username(self, url: str) -> str:
        path = urlparse(url).path.strip("/")
        parts = path.split("/")
        if len(parts) >= 2 and parts[0] == "users":
            return parts[1]
        if len(parts) == 1 and parts[0]:
            return parts[0]
        raise ValueError(f"Cannot extract CodeChef username from URL: {url}")
