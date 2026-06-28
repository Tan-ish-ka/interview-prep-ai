"""Pydantic schemas for the Interview Coach chat endpoint."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class ConversationMessage(BaseModel):
    """A single turn in the conversation history."""

    role: Literal["user", "assistant"]
    content: str


class ProfileContext(BaseModel):
    """Subset of the user profile for the coach's context."""

    username: str = ""
    platform: str = ""
    current_rating: int | None = None
    max_rating: int | None = None
    total_solved: int = 0


class InsightsContext(BaseModel):
    """Analytics insights forwarded to the coach."""

    current_rating: int | None = None
    max_rating: int | None = None
    rating_delta: int | None = None
    recent_rating_delta: int | None = None
    rating_trend: str = "stable"
    contest_stats: dict[str, Any] = Field(default_factory=dict)
    activity_stats: dict[str, Any] = Field(default_factory=dict)
    total_solved: int = 0
    recent_activity: int = 0
    top_tags: dict[str, int] = Field(default_factory=dict)
    weak_topics: list[str] = Field(default_factory=list)
    strong_topics: list[str] = Field(default_factory=list)
    skill_score: int = 0
    momentum_score: int = 0
    potential_efficiency: dict[str, Any] = Field(default_factory=dict)
    ai_insight: dict[str, Any] | None = None


class InterviewPrepContext(BaseModel):
    """Interview preparation data forwarded to the coach."""

    interview_readiness_level: str = ""
    interview_focus_areas: list[dict[str, Any]] = Field(default_factory=list)
    roadmap: list[dict[str, Any]] = Field(default_factory=list)
    company_readiness: list[dict[str, Any]] = Field(default_factory=list)


class CoachChatRequest(BaseModel):
    """Full payload for POST /coach/chat."""

    message: str = Field(..., min_length=1, max_length=4000)
    profile: ProfileContext = Field(default_factory=ProfileContext)
    insights: InsightsContext = Field(default_factory=InsightsContext)
    recommendations: list[str] = Field(default_factory=list)
    interview_preparation: InterviewPrepContext = Field(
        default_factory=InterviewPrepContext
    )
    comparison: dict[str, Any] | None = None
    platforms: dict[str, Any] | None = None
    conversation: list[ConversationMessage] = Field(default_factory=list)
