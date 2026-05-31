"""FastAPI dependency providers."""

from __future__ import annotations

from pathlib import Path

from interview_prep_ai.analytics.insight_generator import InsightGenerator
from interview_prep_ai.cli.main import create_default_profile_manager
from interview_prep_ai.recommendations.recommendation_service import RecommendationService
from interview_prep_ai.services.interview_prep_service import InterviewPrepService

DEFAULT_STORAGE_DIR = Path("data/profiles")


def create_interview_prep_service(
    *,
    storage_dir: Path | str | None = None,
) -> InterviewPrepService:
    """Wire InterviewPrepService with default production dependencies."""
    return InterviewPrepService(
        profile_manager=create_default_profile_manager(
            storage_dir=storage_dir or DEFAULT_STORAGE_DIR
        ),
        insight_generator=InsightGenerator(),
        recommendation_service=RecommendationService(),
    )
