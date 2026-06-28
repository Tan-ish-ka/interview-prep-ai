"""Coordinates profile creation and caching via ProfileService and ProfileRepository."""

from __future__ import annotations

from urllib.parse import urlparse

from interview_prep_ai.core.enums import Platform, PlatformType
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.platform_detector import PlatformDetector
from interview_prep_ai.repositories.profile_repository import ProfileRepository
from interview_prep_ai.services.profile_service import (
    ProfileService,
    UnsupportedPlatformError,
)

_PLATFORM_BY_TYPE: dict[PlatformType, Platform] = {
    PlatformType.CODEFORCES: Platform.CODEFORCES,
    PlatformType.LEETCODE: Platform.LEETCODE,
    PlatformType.CODECHEF: Platform.CODECHEF,
}


class ProfileManager:
    def __init__(
        self,
        *,
        profile_service: ProfileService,
        profile_repository: ProfileRepository,
        platform_detector: type[PlatformDetector] | PlatformDetector = PlatformDetector,
    ) -> None:
        self._profile_service = profile_service
        self._profile_repository = profile_repository
        self._platform_detector = platform_detector

    def get_profile(self, url_or_urls: str | list[str], *, refresh: bool = False) -> UserProfile:
        urls = [url_or_urls] if isinstance(url_or_urls, str) else url_or_urls
        if len(urls) == 1:
            url = urls[0]
            platform_type = self._platform_detector.detect(url)
            if platform_type == PlatformType.UNKNOWN:
                raise UnsupportedPlatformError(f"Unsupported platform for URL: {url}")

            platform = _PLATFORM_BY_TYPE[platform_type]
            username = _extract_username(url, platform_type)

            if not refresh:
                cached = self._profile_repository.load(username, platform)
                if cached is not None:
                    return cached

            profile = self._profile_service.create_profile(url)
            self._profile_repository.save(profile)
            return profile

        # Multiple URLs -> create unified
        # We can cache unified profiles or just cache the underlying ones
        from interview_prep_ai.core.models.profile import merge_profiles
        profiles = []
        for url in urls:
            try:
                profiles.append(self.get_profile(url, refresh=refresh))
            except Exception as e:
                print(f"Error loading {url}: {e}")
        return merge_profiles(profiles)


def _extract_username(url: str, platform_type: PlatformType) -> str:
    path = urlparse(url).path.strip("/")
    parts = path.split("/")

    if platform_type == PlatformType.CODEFORCES:
        if len(parts) >= 2 and parts[0] == "profile":
            return parts[1]
        if len(parts) == 1 and parts[0]:
            return parts[0]
        raise ValueError(f"Cannot extract Codeforces handle from URL: {url}")

    if platform_type == PlatformType.LEETCODE:
        if len(parts) >= 2 and parts[0] == "u":
            return parts[1]
        if len(parts) == 1 and parts[0]:
            return parts[0]
        raise ValueError(f"Cannot extract LeetCode username from URL: {url}")

    if platform_type == PlatformType.CODECHEF:
        if len(parts) >= 2 and parts[0] == "users":
            return parts[1]
        raise ValueError(f"Cannot extract CodeChef username from URL: {url}")

    raise ValueError(f"Cannot extract username for platform: {platform_type}")
