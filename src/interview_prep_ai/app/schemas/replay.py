"""Schemas for AI Contest Replay Analysis."""

from pydantic import BaseModel, Field

# Base schemas for the data the frontend sends to the backend

class TimelineEvent(BaseModel):
    time_minutes: int
    event: str
    problem: str
    description: str

class ContestReplayContext(BaseModel):
    contest_id: str
    problems_attempted: int
    problems_solved: int
    total_penalty_time: int
    time_wasted_minutes: int
    timeline: list[TimelineEvent] = Field(default_factory=list)

# Requests

class AnalyzeContestRequest(BaseModel):
    username: str
    contest: ContestReplayContext
    provider: str = Field(default="openai")
    api_key: str = Field(default="")

class PersonalityRequest(BaseModel):
    username: str
    contests: list[ContestReplayContext] = Field(default_factory=list)
    provider: str = Field(default="openai")
    api_key: str = Field(default="")

class SimulateContestRequest(BaseModel):
    username: str
    contest: ContestReplayContext
    what_if_scenario: str = Field(..., description="E.g., 'If I skipped B at 12m'")
    provider: str = Field(default="openai")
    api_key: str = Field(default="")

class ReplayChatRequest(BaseModel):
    username: str
    contest: ContestReplayContext
    message: str
    conversation: list[dict] = Field(default_factory=list)
    provider: str = Field(default="openai")
    api_key: str = Field(default="")
