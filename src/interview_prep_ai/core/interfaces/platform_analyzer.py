from abc import ABC, abstractmethod

from interview_prep_ai.core.models.profile import UserProfile


class IPlatformAnalyzer(ABC):
    @abstractmethod
    def analyze(self, url: str) -> UserProfile:
        """Fetch platform data and return a normalized user profile."""
        ...
