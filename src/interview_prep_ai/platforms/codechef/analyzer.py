from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile


class CodeChefAnalyzer(IPlatformAnalyzer):
    def analyze(self, url: str) -> UserProfile:
        raise NotImplementedError
