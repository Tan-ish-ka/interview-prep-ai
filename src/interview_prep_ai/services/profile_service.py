"""Facade for creating normalized user profiles from platform profile URLs."""

from __future__ import annotations

from datetime import datetime, timezone
from urllib.parse import urlparse

from interview_prep_ai.api.codeforces_client import CodeforcesClient
from interview_prep_ai.core.analyzer_factory import AnalyzerFactory
from interview_prep_ai.core.enums import Platform, PlatformType
from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.core.platform_detector import PlatformDetector


class UnsupportedPlatformError(Exception):
    """Raised when the profile URL does not map to a supported platform."""


_PLATFORM_BY_TYPE: dict[PlatformType, Platform] = {
    PlatformType.CODEFORCES: Platform.CODEFORCES,
    PlatformType.LEETCODE: Platform.LEETCODE,
    PlatformType.CODECHEF: Platform.CODECHEF,
}


class ProfileService:
    def __init__(
        self,
        *,
        platform_detector: type[PlatformDetector] | PlatformDetector = PlatformDetector,
        analyzer_factory: type[AnalyzerFactory] | AnalyzerFactory = AnalyzerFactory,
        codeforces_client: CodeforcesClient | None = None,
    ) -> None:
        self._platform_detector = platform_detector
        self._analyzer_factory = analyzer_factory
        self._codeforces_client = codeforces_client or CodeforcesClient()

    def create_profile(self, url: str) -> UserProfile:
        platform = self._platform_detector.detect(url)
        if platform == PlatformType.UNKNOWN:
            raise UnsupportedPlatformError(f"Unsupported platform for URL: {url}")

        analyzer = self._analyzer_factory.get_analyzer(platform)

        if platform == PlatformType.CODEFORCES:
            return self._create_codeforces_profile(url, analyzer)

        return analyzer.analyze(url)

    def _create_codeforces_profile(
        self, url: str, _analyzer: IPlatformAnalyzer
    ) -> UserProfile:
        handle = _extract_codeforces_handle(url)
        user_info = self._codeforces_client.get_user_info(handle)
        rating_history = self._codeforces_client.get_user_rating_history(handle)
        submissions = self._codeforces_client.get_user_submissions(handle)
        return _build_codeforces_profile(handle, user_info, rating_history, submissions)


def _extract_codeforces_handle(url: str) -> str:
    path = urlparse(url).path.strip("/")
    parts = path.split("/")
    if len(parts) >= 2 and parts[0] == "profile":
        return parts[1]
    if len(parts) == 1 and parts[0]:
        return parts[0]
    raise ValueError(f"Cannot extract Codeforces handle from URL: {url}")


def _build_codeforces_profile(
    handle: str,
    user_info: dict,
    rating_history: dict,
    submissions: dict,
) -> UserProfile:
    users = user_info.get("result") or []
    user = users[0] if users else {}

    current_rating = user.get("rating")
    max_rating = user.get("maxRating")
    if max_rating is None:
        history = rating_history.get("result") or []
        if history:
            max_rating = max(entry.get("newRating", 0) for entry in history)

    solved_problems = _solved_problems_from_submissions(submissions)

    return UserProfile(
        username=user.get("handle", handle),
        platform=Platform.CODEFORCES,
        current_rating=current_rating,
        max_rating=max_rating,
        solved_problems=solved_problems,
        tag_stats=_tag_stats_from_solved_problems(solved_problems),
        rating_history=rating_history,
    )


def _tag_stats_from_solved_problems(
    solved_problems: list[ProblemRecord],
) -> list[TagStat]:
    counts: dict[str, int] = {}
    for problem in solved_problems:
        for tag in problem.tags:
            normalized = tag.lower()
            counts[normalized] = counts.get(normalized, 0) + 1

    return [
        TagStat(tag=tag, solved_count=count, attempt_count=0)
        for tag, count in sorted(counts.items())
    ]


def _solved_problems_from_submissions(submissions: dict) -> list[ProblemRecord]:
    seen: set[str] = set()
    records: list[ProblemRecord] = []

    for submission in submissions.get("result") or []:
        if submission.get("verdict") != "OK":
            continue

        problem = submission.get("problem") or {}
        problem_id = _problem_id(problem)
        if problem_id in seen:
            continue
        seen.add(problem_id)

        creation_seconds = submission.get("creationTimeSeconds")
        solved_at = (
            datetime.fromtimestamp(creation_seconds, tz=timezone.utc)
            if creation_seconds is not None
            else None
        )

        records.append(
            ProblemRecord(
                problem_id=problem_id,
                title=problem.get("name", problem_id),
                tags=list(problem.get("tags") or []),
                solved_at=solved_at,
            )
        )

    return records


def _problem_id(problem: dict) -> str:
    contest_id = problem.get("contestId")
    index = problem.get("index")
    if contest_id is not None and index is not None:
        return f"{contest_id}{index}"
    return str(problem.get("name", "unknown"))
