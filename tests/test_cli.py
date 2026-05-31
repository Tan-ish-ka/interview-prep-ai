from unittest.mock import MagicMock

import pytest

from interview_prep_ai.cli.main import format_profile_summary, run
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.services.profile_service import UnsupportedPlatformError


@pytest.fixture
def codeforces_url() -> str:
    return "https://codeforces.com/profile/tourist"


@pytest.fixture
def sample_profile() -> UserProfile:
    return UserProfile(
        username="tourist",
        platform=Platform.CODEFORCES,
        current_rating=3858,
        max_rating=3919,
        solved_problems=[
            ProblemRecord(problem_id="1A", title="Theatre Square"),
            ProblemRecord(problem_id="4A", title="Watermelon"),
        ],
    )


@pytest.fixture
def mock_profile_manager(sample_profile: UserProfile) -> MagicMock:
    manager = MagicMock()
    manager.get_profile.return_value = sample_profile
    return manager


def test_valid_url_prints_summary_and_returns_zero(
    mock_profile_manager: MagicMock,
    codeforces_url: str,
    capsys: pytest.CaptureFixture[str],
) -> None:
    exit_code = run(codeforces_url, profile_manager=mock_profile_manager)

    captured = capsys.readouterr()
    assert exit_code == 0
    mock_profile_manager.get_profile.assert_called_once_with(codeforces_url)
    assert "Username: tourist" in captured.out
    assert "Platform: codeforces" in captured.out
    assert "Current Rating: 3858" in captured.out
    assert "Max Rating: 3919" in captured.out
    assert "Solved Problems: 2" in captured.out


def test_invalid_url_prints_error_and_returns_nonzero(
    mock_profile_manager: MagicMock,
    capsys: pytest.CaptureFixture[str],
) -> None:
    invalid_url = "https://example.com/profile/user"
    mock_profile_manager.get_profile.side_effect = UnsupportedPlatformError(
        f"Unsupported platform for URL: {invalid_url}"
    )

    exit_code = run(invalid_url, profile_manager=mock_profile_manager)

    captured = capsys.readouterr()
    assert exit_code == 1
    assert captured.out == ""
    assert "Error:" in captured.err
    assert invalid_url in captured.err


def test_format_profile_summary() -> None:
    profile = UserProfile(
        username="alice",
        platform=Platform.LEETCODE,
        current_rating=1800,
        max_rating=2100,
        solved_problems=[ProblemRecord(problem_id="1", title="Two Sum")],
    )

    summary = format_profile_summary(profile)

    assert summary == (
        "Username: alice\n"
        "Platform: leetcode\n"
        "Current Rating: 1800\n"
        "Max Rating: 2100\n"
        "Solved Problems: 1"
    )


def test_format_profile_summary_handles_missing_ratings() -> None:
    profile = UserProfile(
        username="bob",
        platform=Platform.CODECHEF,
    )

    summary = format_profile_summary(profile)

    assert summary == (
        "Username: bob\n"
        "Platform: codechef\n"
        "Current Rating: N/A\n"
        "Max Rating: N/A\n"
        "Solved Problems: 0"
    )
