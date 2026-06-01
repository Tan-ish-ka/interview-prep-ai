"""Response schemas for interview prep reports."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile


class ProblemRecordSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    problem_id: str
    title: str
    tags: list[str] = Field(default_factory=list)
    solved_at: datetime | None = None


class TagStatSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tag: str
    solved_count: int = 0
    attempt_count: int = 0


class ProfileSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    platform: Platform
    current_rating: int | None = None
    max_rating: int | None = None
    solved_problems: list[ProblemRecordSchema] = Field(default_factory=list)
    tag_stats: list[TagStatSchema] = Field(default_factory=list)
    rating_history: dict[str, Any] = Field(default_factory=dict)


class InsightsSchema(BaseModel):
    current_rating: int | None = None
    max_rating: int | None = None
    rating_delta: int | None = None
    recent_rating_delta: int | None = None
    rating_trend: str = "stable"
    total_solved: int
    recent_activity: int
    top_tags: dict[str, int] = Field(default_factory=dict)
    weak_topics: list[str] = Field(default_factory=list)
    strong_topics: list[str] = Field(default_factory=list)


class ReportResponse(BaseModel):
    profile: ProfileSchema
    insights: InsightsSchema
    recommendations: list[str]


def report_response_from_dict(report: dict[str, Any]) -> ReportResponse:
    """Build an API response model from InterviewPrepService.generate_report output."""
    profile: UserProfile = report["profile"]
    return ReportResponse(
        profile=ProfileSchema.model_validate(profile),
        insights=InsightsSchema.model_validate(report["insights"]),
        recommendations=list(report["recommendations"]),
    )
