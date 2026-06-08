"""Codeforces solved-problem extraction aligned with profile-page semantics."""

from __future__ import annotations

from datetime import datetime, timezone

from interview_prep_ai.core.models.problem import ProblemRecord

SOLVED_COUNT_DEFINITION = (
    "Unique Codeforces programming problems with at least one Accepted (OK) "
    "submission, counted from your full submission history via the Codeforces API. "
    "Matches the number shown on your Codeforces profile when all submissions "
    "are available."
)

_SUBMISSION_PAGE_SIZE = 10_000


def problem_key(problem: dict) -> tuple[str, ...]:
    """Stable deduplication key — avoids contestId/index string collisions."""
    contest_id = problem.get("contestId")
    index = problem.get("index")
    if contest_id is not None and index is not None:
        return ("contest", str(contest_id), str(index))

    problem_id = problem.get("id")
    if problem_id is not None:
        return ("id", str(problem_id))

    return ("name", str(problem.get("name", "unknown")))


def problem_id_from_key(key: tuple[str, ...]) -> str:
    if key[0] == "contest":
        return f"{key[1]}{key[2]}"
    if key[0] == "id":
        return f"id:{key[1]}"
    return f"name:{key[1]}"


def is_countable_solved_submission(submission: dict) -> bool:
    if submission.get("verdict") != "OK":
        return False

    problem = submission.get("problem") or {}
    if problem.get("type") == "QUESTION":
        return False

    return True


def count_unique_solved_submissions(submissions: list[dict]) -> int:
    seen: set[tuple[str, ...]] = set()
    for submission in submissions:
        if not is_countable_solved_submission(submission):
            continue
        problem = submission.get("problem") or {}
        seen.add(problem_key(problem))
    return len(seen)


def solved_problems_from_submissions(submissions: list[dict]) -> list[ProblemRecord]:
    """Return one ProblemRecord per unique accepted programming problem."""
    seen: set[tuple[str, ...]] = set()
    records: list[ProblemRecord] = []

    for submission in submissions:
        if not is_countable_solved_submission(submission):
            continue

        problem = submission.get("problem") or {}
        key = problem_key(problem)
        if key in seen:
            continue
        seen.add(key)

        creation_seconds = submission.get("creationTimeSeconds")
        solved_at = (
            datetime.fromtimestamp(creation_seconds, tz=timezone.utc)
            if creation_seconds is not None
            else None
        )

        records.append(
            ProblemRecord(
                problem_id=problem_id_from_key(key),
                title=problem.get("name", problem_id_from_key(key)),
                tags=list(problem.get("tags") or []),
                solved_at=solved_at,
            )
        )

    return records


def merge_submission_pages(pages: list[dict]) -> list[dict]:
    """Flatten paginated user.status API responses into one submission list."""
    merged: list[dict] = []
    for page in pages:
        merged.extend(page.get("result") or [])
    return merged
