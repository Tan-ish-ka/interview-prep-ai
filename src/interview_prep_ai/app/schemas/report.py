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


class ContestStatsSchema(BaseModel):
    total_contests: int = 0
    contests_last_30_days: int = 0
    average_rating_change: float | None = None


class ActivityStatsSchema(BaseModel):
    problems_last_30_days: int = 0
    problems_last_90_days: int = 0
    average_problems_per_week: float = 0.0


class InterviewFocusAreaSchema(BaseModel):
    area: str
    status: str
    solved_count: int = 0


class RoadmapItemSchema(BaseModel):
    priority: int
    category: str
    title: str
    description: str


class CompanyReadinessSchema(BaseModel):
    company: str
    score: int
    level: str
    reason: str


class InterviewPreparationSchema(BaseModel):
    interview_readiness_level: str
    interview_focus_areas: list[InterviewFocusAreaSchema] = Field(default_factory=list)
    roadmap: list[RoadmapItemSchema] = Field(default_factory=list)
    company_readiness: list[CompanyReadinessSchema] = Field(default_factory=list)


class InsightsSchema(BaseModel):
    current_rating: int | None = None
    max_rating: int | None = None
    rating_delta: int | None = None
    recent_rating_delta: int | None = None
    rating_trend: str = "stable"
    contest_stats: ContestStatsSchema = Field(default_factory=ContestStatsSchema)
    activity_stats: ActivityStatsSchema = Field(default_factory=ActivityStatsSchema)
    total_solved: int
    recent_activity: int
    top_tags: dict[str, int] = Field(default_factory=dict)
    weak_topics: list[str] = Field(default_factory=list)
    strong_topics: list[str] = Field(default_factory=list)
    skill_score: int = 0
    momentum_score: int = 0


class ReportResponse(BaseModel):
    profile: ProfileSchema
    insights: InsightsSchema
    recommendations: list[str]
    interview_preparation: InterviewPreparationSchema


def report_response_from_dict(report: dict[str, Any]) -> ReportResponse:
    """Build an API response model from InterviewPrepService.generate_report output."""
    profile: UserProfile = report["profile"]
    return ReportResponse(
        profile=ProfileSchema.model_validate(profile),
        insights=InsightsSchema.model_validate(report["insights"]),
        recommendations=list(report["recommendations"]),
        interview_preparation=InterviewPreparationSchema.model_validate(
            report["interview_preparation"]
        ),
    )
