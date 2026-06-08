"""Command-line entry point for loading and displaying user profiles."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import TextIO

from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.repositories.json_profile_repository import JsonProfileRepository
from interview_prep_ai.services.profile_manager import ProfileManager
from interview_prep_ai.services.profile_service import (
    ProfileService,
    UnsupportedPlatformError,
)

DEFAULT_STORAGE_DIR = Path("data/profiles")


def format_profile_summary(profile: UserProfile) -> str:
    """Return a simple multi-line summary for a user profile."""
    current_rating = (
        str(profile.current_rating)
        if profile.current_rating is not None
        else "N/A"
    )
    max_rating = (
        str(profile.max_rating) if profile.max_rating is not None else "N/A"
    )
    return "\n".join(
        [
            f"Username: {profile.username}",
            f"Platform: {profile.platform.value}",
            f"Current Rating: {current_rating}",
            f"Max Rating: {max_rating}",
            f"Solved Problems: {profile.total_solved or len(profile.solved_problems)}",
        ]
    )


def create_default_profile_manager(
    *,
    storage_dir: Path | str | None = None,
) -> ProfileManager:
    """Build a ProfileManager with default service and repository dependencies."""
    return ProfileManager(
        profile_service=ProfileService(),
        profile_repository=JsonProfileRepository(
            storage_dir or DEFAULT_STORAGE_DIR
        ),
    )


def run(
    url: str,
    *,
    profile_manager: ProfileManager | None = None,
    stdout: TextIO | None = None,
    stderr: TextIO | None = None,
) -> int:
    """Load a profile for the given URL and print a summary."""
    out = stdout or sys.stdout
    err = stderr or sys.stderr
    manager = profile_manager or create_default_profile_manager()

    try:
        profile = manager.get_profile(url)
    except (UnsupportedPlatformError, ValueError) as exc:
        print(f"Error: {exc}", file=err)
        return 1

    print(format_profile_summary(profile), file=out)
    return 0


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Load a competitive programming profile and print a summary."
    )
    parser.add_argument("url", help="Profile URL (Codeforces, LeetCode, or CodeChef)")
    args = parser.parse_args(argv)
    raise SystemExit(run(args.url))


if __name__ == "__main__":
    main()
