"""Orchestrates profile loading, insight generation, and recommendations."""

from __future__ import annotations

from typing import Any

from interview_prep_ai.analytics.insight_generator import InsightGenerator
from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine
from interview_prep_ai.recommendations.recommendation_service import RecommendationService
from interview_prep_ai.services.profile_manager import ProfileManager


class InterviewPrepService:
    def __init__(
        self,
        *,
        profile_manager: ProfileManager,
        insight_generator: InsightGenerator,
        recommendation_service: RecommendationService,
        interview_prep_engine: InterviewPrepEngine | None = None,
    ) -> None:
        self._profile_manager = profile_manager
        self._insight_generator = insight_generator
        self._recommendation_service = recommendation_service
        self._interview_prep_engine = interview_prep_engine or InterviewPrepEngine()

    def generate_report(self, url: str) -> dict[str, Any]:
        profile = self._profile_manager.get_profile(url, refresh=True)
        insights = self._insight_generator.generate(profile, profile.rating_history)
        recommendations = self._recommendation_service.generate(insights)
        interview_preparation = self._interview_prep_engine.generate(insights)
        return {
            "profile": profile,
            "insights": insights,
            "recommendations": recommendations,
            "interview_preparation": interview_preparation,
        }
