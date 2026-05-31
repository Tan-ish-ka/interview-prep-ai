from unittest.mock import MagicMock

import pytest

from interview_prep_ai.core.enums import Platform, PlatformType
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.services.profile_manager import ProfileManager


@pytest.fixture
def codeforces_url() -> str:
    return "https://codeforces.com/profile/tourist"


@pytest.fixture
def cached_profile() -> UserProfile:
    return UserProfile(
        username="tourist",
        platform=Platform.CODEFORCES,
        current_rating=3858,
        max_rating=3919,
    )


@pytest.fixture
def created_profile() -> UserProfile:
    return UserProfile(
        username="tourist",
        platform=Platform.CODEFORCES,
        current_rating=3900,
        max_rating=3950,
    )


@pytest.fixture
def mock_profile_service(created_profile: UserProfile) -> MagicMock:
    service = MagicMock()
    service.create_profile.return_value = created_profile
    return service


@pytest.fixture
def mock_profile_repository() -> MagicMock:
    return MagicMock()


@pytest.fixture
def mock_platform_detector() -> MagicMock:
    detector = MagicMock()
    detector.detect.return_value = PlatformType.CODEFORCES
    return detector


@pytest.fixture
def manager(
    mock_profile_service: MagicMock,
    mock_profile_repository: MagicMock,
    mock_platform_detector: MagicMock,
) -> ProfileManager:
    return ProfileManager(
        profile_service=mock_profile_service,
        profile_repository=mock_profile_repository,
        platform_detector=mock_platform_detector,
    )


def test_existing_profile_is_returned_from_repository(
    manager: ProfileManager,
    mock_profile_repository: MagicMock,
    codeforces_url: str,
    cached_profile: UserProfile,
) -> None:
    mock_profile_repository.load.return_value = cached_profile

    result = manager.get_profile(codeforces_url)

    assert result is cached_profile
    mock_profile_repository.load.assert_called_once_with(
        "tourist", Platform.CODEFORCES
    )


def test_profile_service_is_not_called_when_cache_exists(
    manager: ProfileManager,
    mock_profile_service: MagicMock,
    mock_profile_repository: MagicMock,
    codeforces_url: str,
    cached_profile: UserProfile,
) -> None:
    mock_profile_repository.load.return_value = cached_profile

    manager.get_profile(codeforces_url)

    mock_profile_service.create_profile.assert_not_called()
    mock_profile_repository.save.assert_not_called()


def test_missing_profile_triggers_profile_service(
    manager: ProfileManager,
    mock_profile_service: MagicMock,
    mock_profile_repository: MagicMock,
    codeforces_url: str,
) -> None:
    mock_profile_repository.load.return_value = None

    manager.get_profile(codeforces_url)

    mock_profile_service.create_profile.assert_called_once_with(codeforces_url)


def test_newly_created_profile_is_saved(
    manager: ProfileManager,
    mock_profile_service: MagicMock,
    mock_profile_repository: MagicMock,
    codeforces_url: str,
    created_profile: UserProfile,
) -> None:
    mock_profile_repository.load.return_value = None

    manager.get_profile(codeforces_url)

    mock_profile_repository.save.assert_called_once_with(created_profile)


def test_returned_profile_is_correct(
    manager: ProfileManager,
    mock_profile_repository: MagicMock,
    codeforces_url: str,
    created_profile: UserProfile,
) -> None:
    mock_profile_repository.load.return_value = None

    result = manager.get_profile(codeforces_url)

    assert result is created_profile
    assert result.username == "tourist"
    assert result.platform == Platform.CODEFORCES
    assert result.current_rating == 3900
    assert result.max_rating == 3950
