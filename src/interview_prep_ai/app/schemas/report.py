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
    total_solved: int = 0
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


class PreviousQuestionSchema(BaseModel):
    title: str
    platform: str
    difficulty: str
    tags: list[str]
    frequency: str
    year: str


class GapAnalysisItemSchema(BaseModel):
    topic: str
    current_coverage: int
    target_coverage: int
    recommendation: str


class CompanyReadinessSchema(BaseModel):
    company: str
    category: str
    overall_readiness: int
    level: str
    topic_radar: dict[str, int] = Field(default_factory=dict)
    difficulty_distribution: dict[str, float] = Field(default_factory=dict)
    previous_questions: list[PreviousQuestionSchema] = Field(default_factory=list)
    gap_analysis: list[GapAnalysisItemSchema] = Field(default_factory=list)


class InterviewPreparationSchema(BaseModel):
    interview_readiness_level: str
    interview_focus_areas: list[InterviewFocusAreaSchema] = Field(default_factory=list)
    roadmap: list[RoadmapItemSchema] = Field(default_factory=list)
    company_readiness: list[CompanyReadinessSchema] = Field(default_factory=list)


class StudyGuidanceSchema(BaseModel):
    why_this_score: str = ""
    what_to_improve_next: str = ""
    confidence_builders: str = ""


class PotentialEfficiencySchema(BaseModel):
    efficiency_score: int = 0
    efficiency_trend: str = "stable"
    efficiency_summary: str = ""
    growth_potential: str = "Moderate potential"
    growth_reason: str = ""
    guidance: StudyGuidanceSchema = Field(default_factory=StudyGuidanceSchema)


class InsightsSchema(BaseModel):
    current_rating: int | None = None
    max_rating: int | None = None
    rating_delta: int | None = None
    recent_rating_delta: int | None = None
    rating_trend: str = "stable"
    contest_stats: ContestStatsSchema = Field(default_factory=ContestStatsSchema)
    activity_stats: ActivityStatsSchema = Field(default_factory=ActivityStatsSchema)
    total_solved: int
    solved_count_definition: str = (
        "Unique Codeforces programming problems with at least one Accepted (OK) "
        "submission, counted from your full submission history via the Codeforces API."
    )
    recent_activity: int
    top_tags: dict[str, int] = Field(default_factory=dict)
    weak_topics: list[str] = Field(default_factory=list)
    strong_topics: list[str] = Field(default_factory=list)
    skill_score: int = 0
    momentum_score: int = 0
    potential_efficiency: PotentialEfficiencySchema = Field(
        default_factory=PotentialEfficiencySchema
    )
    platform_specific: dict[str, Any] = Field(
        description="Platform-specific analytics (e.g. stars, active days, etc).",
        default_factory=dict
    )


class RootCauseSchema(BaseModel):
    issue: str
    inferred_cause: str
    recommendation: str
    confidence_score: float
    data_points: list[str] = Field(default_factory=list)


class FailureIntelligenceSchema(BaseModel):
    total_submissions: int = 0
    verdict_counts: dict[str, int] = Field(default_factory=dict)
    verdict_rates: dict[str, float] = Field(default_factory=dict)
    average_attempts_before_ac: float = 0.0
    root_causes: list[RootCauseSchema] = Field(default_factory=list)


class DNATraitSchema(BaseModel):
    trait: str
    description: str
    type: str
    confidence_score: float
    reason: str


class LearningDNASchema(BaseModel):
    dna_traits: list[DNATraitSchema] = Field(default_factory=list)


class HiddenPotentialSchema(BaseModel):
    current_rating: int
    potential_rating: int
    gap: int
    reasons: list[str] = Field(default_factory=list)
    confidence_score: float


class ContestTimelineEventSchema(BaseModel):
    time_minutes: int
    event: str
    problem: str
    description: str


class ContestReplaySchema(BaseModel):
    contest_id: str
    problems_attempted: int
    problems_solved: int
    total_penalty_time: int
    time_wasted_minutes: int
    timeline: list[ContestTimelineEventSchema] = Field(default_factory=list)
    date: str


class MissedOpportunitySchema(BaseModel):
    contest_id: str
    problem_id: str
    topic: str
    reason: str
    difficulty: int = 1700
    tags: list[str] = Field(default_factory=list)
    historical_solve_probability: float = 80.0
    estimated_solve_time: int = 15
    recommendation: str = ""


class ReportResponse(BaseModel):
    profile: ProfileSchema
    insights: InsightsSchema
    recommendations: list[str]
    interview_preparation: InterviewPreparationSchema
    failure_intelligence: FailureIntelligenceSchema | None = None
    learning_dna: LearningDNASchema | None = None
    hidden_potential: HiddenPotentialSchema | None = None
    contest_replays: list[ContestReplaySchema] = Field(default_factory=list)
    missed_opportunities: list[MissedOpportunitySchema] = Field(default_factory=list)
    contributions: dict[str, float] = Field(default_factory=dict)
    activity_feed: list[dict] = Field(default_factory=list)
    skill_matrix: dict[str, float] = Field(default_factory=dict)


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
        failure_intelligence=FailureIntelligenceSchema.model_validate(report["failure_intelligence"]) if "failure_intelligence" in report else None,
        learning_dna=LearningDNASchema.model_validate(report["learning_dna"]) if "learning_dna" in report else None,
        hidden_potential=HiddenPotentialSchema.model_validate(report["hidden_potential"]) if "hidden_potential" in report else None,
        contest_replays=[ContestReplaySchema.model_validate(r) for r in report.get("contest_replays", [])],
        missed_opportunities=[MissedOpportunitySchema.model_validate(m) for m in report.get("missed_opportunities", [])],
        contributions=report.get("contributions", {}),
        activity_feed=report.get("activity_feed", []),
        skill_matrix=report.get("skill_matrix", {}),
    )
