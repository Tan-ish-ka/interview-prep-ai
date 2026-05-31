"""Pydantic request and response schemas."""

from interview_prep_ai.app.schemas.query import ReportQueryParams
from interview_prep_ai.app.schemas.report import ReportResponse

__all__ = ["ReportQueryParams", "ReportResponse"]
