from abc import ABC, abstractmethod

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile


class ProfileRepository(ABC):
    @abstractmethod
    def save(self, profile: UserProfile) -> None:
        """Persist a user profile."""

    @abstractmethod
    def load(self, username: str, platform: Platform) -> UserProfile | None:
        """Load a user profile by username and platform, or None if not found."""
