"""Pydantic schemas for the AI Solution Intelligence Engine."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class SolutionAnalyzeRequest(BaseModel):
    """Request payload for POST /solution/analyze."""

    code: str = Field(..., min_length=1, max_length=50000, description="The source code to analyze.")
    language: Literal["cpp", "java", "python", "javascript", "other"] = Field(
        default="cpp", description="Programming language of the code."
    )
    problem_id: str = Field(default="", description="Optional problem ID (e.g. '1234A').")
    problem_title: str = Field(default="", description="Optional problem title.")
    problem_tags: list[str] = Field(default_factory=list, description="Tags/topics of the problem.")
    verdict: str = Field(
        default="",
        description="Submission verdict: OK, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, RUNTIME_ERROR, COMPILATION_ERROR, or empty.",
    )
    # Profile context for personalization (optional)
    username: str = Field(default="")
    strong_topics: list[str] = Field(default_factory=list)
    weak_topics: list[str] = Field(default_factory=list)
    learning_dna_traits: list[str] = Field(default_factory=list)
    root_cause_summary: str = Field(default="")
    target_companies: list[str] = Field(default_factory=list)
