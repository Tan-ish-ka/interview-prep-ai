from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.repositories.profile_repository import ProfileRepository


class JsonProfileRepository(ProfileRepository):
    def __init__(self, storage_dir: Path | str) -> None:
        self._storage_dir = Path(storage_dir)

    def save(self, profile: UserProfile) -> None:
        path = self._profile_path(profile.username, profile.platform)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            json.dumps(_profile_to_dict(profile), indent=2),
            encoding="utf-8",
        )

    def load(self, username: str, platform: Platform) -> UserProfile | None:
        path = self._profile_path(username, platform)
        if not path.is_file():
            return None
        data = json.loads(path.read_text(encoding="utf-8"))
        return _profile_from_dict(data)

    def _profile_path(self, username: str, platform: Platform) -> Path:
        return self._storage_dir / platform.value / f"{username}.json"


def _profile_to_dict(profile: UserProfile) -> dict:
    return {
        "username": profile.username,
        "platform": profile.platform.value,
        "current_rating": profile.current_rating,
        "max_rating": profile.max_rating,
        "total_solved": profile.total_solved,
        "solved_problems": [
            {
                "problem_id": problem.problem_id,
                "title": problem.title,
                "tags": problem.tags,
                "solved_at": (
                    problem.solved_at.isoformat() if problem.solved_at else None
                ),
            }
            for problem in profile.solved_problems
        ],
        "tag_stats": [
            {
                "tag": stat.tag,
                "solved_count": stat.solved_count,
                "attempt_count": stat.attempt_count,
            }
            for stat in profile.tag_stats
        ],
        "all_submissions": [
            {
                "id": sub.id,
                "problem": {
                    "problem_id": sub.problem.problem_id,
                    "title": sub.problem.title,
                    "tags": sub.problem.tags,
                    "solved_at": sub.problem.solved_at.isoformat() if sub.problem.solved_at else None,
                },
                "verdict": sub.verdict,
                "language": sub.language,
                "time_consumed_millis": sub.time_consumed_millis,
                "memory_consumed_bytes": sub.memory_consumed_bytes,
                "passed_test_count": sub.passed_test_count,
                "participant_type": sub.participant_type,
                "relative_time_seconds": sub.relative_time_seconds,
                "submitted_at": sub.submitted_at.isoformat() if sub.submitted_at else None,
            }
            for sub in profile.all_submissions
        ],
        "rating_history": profile.rating_history,
    }


from interview_prep_ai.core.models.submission import SubmissionRecord

def _profile_from_dict(data: dict) -> UserProfile:
    solved_problems = [
            ProblemRecord(
                problem_id=problem["problem_id"],
                title=problem["title"],
                tags=list(problem.get("tags") or []),
                solved_at=(
                    datetime.fromisoformat(problem["solved_at"])
                    if problem.get("solved_at")
                    else None
                ),
            )
            for problem in data.get("solved_problems") or []
    ]
    
    all_submissions = [
        SubmissionRecord(
            id=sub["id"],
            problem=ProblemRecord(
                problem_id=sub["problem"]["problem_id"],
                title=sub["problem"]["title"],
                tags=list(sub["problem"].get("tags") or []),
                solved_at=(
                    datetime.fromisoformat(sub["problem"]["solved_at"])
                    if sub["problem"].get("solved_at")
                    else None
                ),
            ),
            verdict=sub["verdict"],
            language=sub["language"],
            time_consumed_millis=sub["time_consumed_millis"],
            memory_consumed_bytes=sub["memory_consumed_bytes"],
            passed_test_count=sub["passed_test_count"],
            participant_type=sub.get("participant_type", ""),
            relative_time_seconds=sub.get("relative_time_seconds", 0),
            submitted_at=(
                datetime.fromisoformat(sub["submitted_at"])
                if sub.get("submitted_at")
                else None
            ),
        )
        for sub in data.get("all_submissions") or []
    ]
    
    return UserProfile(
        username=data["username"],
        platform=Platform(data["platform"]),
        current_rating=data.get("current_rating"),
        max_rating=data.get("max_rating"),
        total_solved=data.get("total_solved", len(solved_problems)),
        solved_problems=solved_problems,
        tag_stats=[
            TagStat(
                tag=stat["tag"],
                solved_count=stat.get("solved_count", 0),
                attempt_count=stat.get("attempt_count", 0),
            )
            for stat in data.get("tag_stats") or []
        ],
        all_submissions=all_submissions,
        rating_history=data.get("rating_history") or {"status": "OK", "result": []},
    )
