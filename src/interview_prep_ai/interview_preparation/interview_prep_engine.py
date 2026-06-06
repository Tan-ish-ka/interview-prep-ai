"""Generate interview readiness, focus areas, and preparation roadmap."""

from __future__ import annotations

from typing import Any

from interview_prep_ai.interview_preparation.company_readiness_scorer import (
    score_company_readiness,
)
from interview_prep_ai.interview_preparation.readiness_analyzer import (
    determine_readiness_level,
)
from interview_prep_ai.interview_preparation.roadmap_generator import build_roadmap
from interview_prep_ai.interview_preparation.topic_mapper import map_interview_focus_areas


class InterviewPrepEngine:
    def generate(self, insights: dict[str, Any]) -> dict[str, Any]:
        focus_areas = map_interview_focus_areas(insights)
        readiness_level = determine_readiness_level(insights, focus_areas)
        roadmap = build_roadmap(insights, focus_areas)

        company_readiness = score_company_readiness(
            insights,
            interview_readiness_level=readiness_level,
        )

        return {
            "interview_readiness_level": readiness_level,
            "interview_focus_areas": focus_areas,
            "roadmap": roadmap,
            "company_readiness": company_readiness,
        }
