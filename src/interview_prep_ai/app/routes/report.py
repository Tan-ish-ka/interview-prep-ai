"""Report generation HTTP routes."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query

from interview_prep_ai.app.schemas.query import ReportQueryParams
from interview_prep_ai.app.schemas.report import ReportResponse, report_response_from_dict
from interview_prep_ai.services.interview_prep_service import InterviewPrepService

router = APIRouter(tags=["report"])


def get_interview_prep_service() -> InterviewPrepService:
    from interview_prep_ai.app.dependencies import create_interview_prep_service

    return create_interview_prep_service()


@router.get("/report", response_model=ReportResponse)
def get_report(
    query: Annotated[ReportQueryParams, Query()],
    service: Annotated[InterviewPrepService, Depends(get_interview_prep_service)],
) -> ReportResponse:
    """Generate an interview prep report for a competitive programming profile URL."""
    report = service.generate_report(query.url)
    return report_response_from_dict(report)
