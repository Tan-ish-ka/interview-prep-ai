from urllib.parse import urlparse

from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.api.codeforces_client import CodeforcesClient


class CodeforcesAnalyzer(IPlatformAnalyzer):
    def __init__(self, codeforces_client: CodeforcesClient | None = None) -> None:
        self._codeforces_client = codeforces_client or CodeforcesClient()
        
    def analyze(self, url: str) -> UserProfile:
        """Fetch and create Codeforces profile."""
        from interview_prep_ai.services.profile_service import (
            _build_codeforces_profile,
            _extract_codeforces_handle
        )
        
        handle = _extract_codeforces_handle(url)
        user_info = self._codeforces_client.get_user_info(handle)
        rating_history = self._codeforces_client.get_user_rating_history(handle)
        submissions = self._codeforces_client.get_user_submissions(handle)
        return _build_codeforces_profile(handle, user_info, rating_history, submissions)
