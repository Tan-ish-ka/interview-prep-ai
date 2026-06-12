from unittest.mock import MagicMock

import pytest

from interview_prep_ai.core.enums import Platform, PlatformType
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.platforms.codeforces.analyzer import CodeforcesAnalyzer
from interview_prep_ai.services.profile_service import (
    ProfileService,
    UnsupportedPlatformError,
)


@pytest.fixture
def codeforces_url() -> str:
    return "https://codeforces.com/profile/tourist"


@pytest.fixture
def mock_platform_detector() -> MagicMock:
    detector = MagicMock()
    detector.detect.return_value = PlatformType.CODEFORCES
    return detector


@pytest.fixture
def mock_analyzer_factory() -> MagicMock:
    factory = MagicMock()
    factory.get_analyzer.return_value = CodeforcesAnalyzer()
    return factory


@pytest.fixture
def mock_codeforces_client() -> MagicMock:
    client = MagicMock()
    client.get_user_info.return_value = {
        "status": "OK",
        "result": [
            {
                "handle": "tourist",
                "rating": 3858,
                "maxRating": 3919,
            }
        ],
    }
    client.get_user_rating_history.return_value = {
        "status": "OK",
        "result": [{"newRating": 3919}],
    }
    client.get_user_submissions.return_value = {
        "status": "OK",
        "result": [
            {
                "verdict": "OK",
                "creationTimeSeconds": 1_700_000_000,
                "problem": {
                    "contestId": 1,
                    "index": "A",
                    "name": "Test Problem",
                    "tags": ["math"],
                },
            }
        ],
    }
    return client


@pytest.fixture
def service(
    mock_platform_detector: MagicMock,
    mock_analyzer_factory: MagicMock,
    mock_codeforces_client: MagicMock,
) -> ProfileService:
    return ProfileService(
        platform_detector=mock_platform_detector,
        analyzer_factory=mock_analyzer_factory,
        codeforces_client=mock_codeforces_client,
    )


def test_platform_detector_is_called(
    service: ProfileService,
    mock_platform_detector: MagicMock,
    codeforces_url: str,
) -> None:
    service.create_profile(codeforces_url)

    mock_platform_detector.detect.assert_called_once_with(codeforces_url)


def test_analyzer_factory_is_called(
    service: ProfileService,
    mock_analyzer_factory: MagicMock,
    mock_codeforces_client: MagicMock,
    codeforces_url: str,
) -> None:
    service.create_profile(codeforces_url)

    mock_analyzer_factory.get_analyzer.assert_called_once_with(
        PlatformType.CODEFORCES,
        codeforces_client=mock_codeforces_client,
    )


def test_codeforces_client_methods_are_called(
    service: ProfileService,
    mock_codeforces_client: MagicMock,
    codeforces_url: str,
) -> None:
    service.create_profile(codeforces_url)

    mock_codeforces_client.get_user_info.assert_called_once_with("tourist")
    mock_codeforces_client.get_user_rating_history.assert_called_once_with("tourist")
    mock_codeforces_client.get_user_submissions.assert_called_once_with("tourist")


def test_user_profile_is_returned(
    service: ProfileService,
    codeforces_url: str,
) -> None:
    profile = service.create_profile(codeforces_url)

    assert isinstance(profile, UserProfile)
    assert profile.username == "tourist"
    assert profile.platform == Platform.CODEFORCES
    assert profile.current_rating == 3858
    assert profile.max_rating == 3919
    assert profile.total_solved == 1
    assert len(profile.solved_problems) == 1
    problem = profile.solved_problems[0]
    assert problem.problem_id == "1A"
    assert problem.title == "Test Problem"
    assert problem.tags == ["math"]
    assert problem.solved_at is not None
    assert profile.tag_stats == [TagStat(tag="Math", solved_count=1, attempt_count=0)]
    assert profile.rating_history == {
        "status": "OK",
        "result": [{"newRating": 3919}],
    }


def test_tag_stats_built_from_solved_problem_tags(
    mock_platform_detector: MagicMock,
    mock_analyzer_factory: MagicMock,
    mock_codeforces_client: MagicMock,
    codeforces_url: str,
) -> None:
    mock_codeforces_client.get_user_submissions.return_value = {
        "status": "OK",
        "result": [
            {
                "verdict": "OK",
                "creationTimeSeconds": 1_700_000_000,
                "problem": {
                    "contestId": 1,
                    "index": "A",
                    "name": "Problem A",
                    "tags": ["dp", "graphs"],
                },
            },
            {
                "verdict": "OK",
                "creationTimeSeconds": 1_700_000_100,
                "problem": {
                    "contestId": 2,
                    "index": "B",
                    "name": "Problem B",
                    "tags": ["graphs", "DP"],
                },
            },
            {
                "verdict": "WRONG_ANSWER",
                "problem": {
                    "contestId": 3,
                    "index": "C",
                    "name": "Problem C",
                    "tags": ["greedy"],
                },
            },
        ],
    }
    service = ProfileService(
        platform_detector=mock_platform_detector,
        analyzer_factory=mock_analyzer_factory,
        codeforces_client=mock_codeforces_client,
    )

    profile = service.create_profile(codeforces_url)

    assert profile.tag_stats == [
        TagStat(tag="Dynamic Programming", solved_count=2, attempt_count=0),
        TagStat(tag="Graphs", solved_count=2, attempt_count=0),
    ]


def test_unsupported_platform_raises(
    mock_analyzer_factory: MagicMock,
    mock_codeforces_client: MagicMock,
) -> None:
    detector = MagicMock()
    detector.detect.return_value = PlatformType.UNKNOWN
    service = ProfileService(
        platform_detector=detector,
        analyzer_factory=mock_analyzer_factory,
        codeforces_client=mock_codeforces_client,
    )

    with pytest.raises(UnsupportedPlatformError, match="Unsupported platform"):
        service.create_profile("https://example.com/user/foo")

    detector.detect.assert_called_once_with("https://example.com/user/foo")
    mock_analyzer_factory.get_analyzer.assert_not_called()
    mock_codeforces_client.get_user_info.assert_not_called()
