from datetime import datetime, timezone
from pathlib import Path

import pytest

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.repositories.json_profile_repository import JsonProfileRepository


@pytest.fixture
def storage_dir(tmp_path: Path) -> Path:
    return tmp_path / "profiles"


@pytest.fixture
def repository(storage_dir: Path) -> JsonProfileRepository:
    return JsonProfileRepository(storage_dir)


@pytest.fixture
def sample_profile() -> UserProfile:
    return UserProfile(
        username="tourist",
        platform=Platform.CODEFORCES,
        current_rating=3858,
        max_rating=3919,
        total_solved=1,
        solved_problems=[
            ProblemRecord(
                problem_id="1A",
                title="Test Problem",
                tags=["math"],
                solved_at=datetime(2023, 11, 14, 22, 13, 20, tzinfo=timezone.utc),
            )
        ],
        tag_stats=[TagStat(tag="math", solved_count=1, attempt_count=2)],
        rating_history={
            "status": "OK",
            "result": [{"oldRating": 3800, "newRating": 3919}],
        },
    )


def test_save_profile_successfully(
    repository: JsonProfileRepository,
    storage_dir: Path,
    sample_profile: UserProfile,
) -> None:
    repository.save(sample_profile)

    profile_path = storage_dir / "codeforces" / "tourist.json"
    assert profile_path.is_file()
    assert profile_path.read_text(encoding="utf-8")


def test_load_profile_successfully(
    repository: JsonProfileRepository,
    sample_profile: UserProfile,
) -> None:
    repository.save(sample_profile)

    loaded = repository.load("tourist", Platform.CODEFORCES)

    assert loaded == sample_profile


def test_missing_profile_returns_none(repository: JsonProfileRepository) -> None:
    loaded = repository.load("missing_user", Platform.LEETCODE)

    assert loaded is None
