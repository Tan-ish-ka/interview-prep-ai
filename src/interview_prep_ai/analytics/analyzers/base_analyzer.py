from abc import ABC, abstractmethod
from interview_prep_ai.core.models.profile import UserProfile

class BaseAnalyzer(ABC):
    @abstractmethod
    def generate(self, profile: UserProfile, rating_history: dict) -> dict:
        """Generate platform-specific insights."""
        pass
