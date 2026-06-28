"""CodeChef profile analyzer."""

from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.api.codechef_client import CodeChefClient
import re

class CodeChefAnalyzer(IPlatformAnalyzer):
    def __init__(self, codechef_client: CodeChefClient | None = None):
        self._client = codechef_client or CodeChefClient()

    def analyze(self, handle: str) -> UserProfile:
        match = re.search(r"codechef\.com/users/([^/]+)", handle)
        if match:
            handle = match.group(1)

        data = self._client.get_user_profile(handle)
        
        platform_specific = {
            "highest_rating": data.get("highest_rating", 0),
            "stars": data.get("stars", "1★"),
            "global_rank": data.get("global_rank", "NA"),
            "country_rank": data.get("country_rank", "NA")
        }
        
        return UserProfile(
            username=handle,
            platform=Platform.CODECHEF,
            current_rating=data.get("current_rating", 0),
            max_rating=data.get("highest_rating", 0),
            total_solved=data.get("total_solved", 0),
            platform_specific=platform_specific,
            tag_stats=[] # CodeChef public profile doesn't easily expose tags
        )
