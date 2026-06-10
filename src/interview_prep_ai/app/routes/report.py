"""Report generation HTTP routes."""

from __future__ import annotations

from typing import Annotated, Dict

from fastapi import APIRouter, Depends, Query

from interview_prep_ai.app.schemas.query import ReportQueryParams
from interview_prep_ai.app.schemas.report import ReportResponse, report_response_from_dict
from interview_prep_ai.services.interview_prep_service import InterviewPrepService
from interview_prep_ai.core.enums import Platform, PlatformType
from interview_prep_ai.core.platform_detector import PlatformDetector
from interview_prep_ai.services.profile_manager import ProfileManager
from interview_prep_ai.analytics.comparison_engine import compare_profiles
from interview_prep_ai.cli.main import create_default_profile_manager
from interview_prep_ai.services.unified_profile_service import (
    UnifiedProfileService,
    UnifiedProfile
)

router = APIRouter(tags=["report"])


def get_interview_prep_service() -> InterviewPrepService:
    from interview_prep_ai.app.dependencies import create_interview_prep_service

    return create_interview_prep_service()


def get_profile_manager() -> ProfileManager:
    return create_default_profile_manager()


def get_unified_profile_service() -> UnifiedProfileService:
    return UnifiedProfileService()


@router.get("/report", response_model=ReportResponse)
def get_report(
    query: Annotated[ReportQueryParams, Query()],
    service: Annotated[InterviewPrepService, Depends(get_interview_prep_service)],
) -> ReportResponse:
    """Generate an interview prep report for a competitive programming profile URL."""
    report = service.generate_report(query.url)
    return report_response_from_dict(report)


@router.get("/compare")
def get_comparison(
    handle_a: Annotated[str, Query(description="First Codeforces handle")],
    handle_b: Annotated[str, Query(description="Second Codeforces handle")],
    manager: Annotated[ProfileManager, Depends(get_profile_manager)],
) -> dict:
    """Generate a comparison between two Codeforces profiles."""
    # Build Codeforces URLs
    url_a = f"https://codeforces.com/profile/{handle_a}"
    url_b = f"https://codeforces.com/profile/{handle_b}"
    
    # Get profiles
    profile_a = manager.get_profile(url_a)
    profile_b = manager.get_profile(url_b)
    
    # Compare
    return compare_profiles(profile_a, profile_b)


@router.get("/platforms/analysis")
def get_platform_analysis(
    codeforces_handle: Annotated[str, Query(description="Codeforces handle")],
    leetcode_handle: Annotated[str, Query(description="LeetCode handle")] = "",
    codechef_handle: Annotated[str, Query(description="CodeChef handle")] = "",
    *,
    manager: Annotated[ProfileManager, Depends(get_profile_manager)],
    unified_service: Annotated[UnifiedProfileService, Depends(get_unified_profile_service)],
) -> dict:
    """Generate analysis for multiple platforms."""
    platform_profiles: Dict[Platform, any] = {}
    
    # Codeforces
    if codeforces_handle:
        url = f"https://codeforces.com/profile/{codeforces_handle}"
        platform_profiles[Platform.CODEFORCES] = manager.get_profile(url)
        
    # LeetCode
    if leetcode_handle:
        url = f"https://leetcode.com/u/{leetcode_handle}"
        platform_profiles[Platform.LEETCODE] = manager.get_profile(url)
        
    # CodeChef
    if codechef_handle:
        url = f"https://www.codechef.com/users/{codechef_handle}"
        platform_profiles[Platform.CODECHEF] = manager.get_profile(url)
        
    # Create unified profile
    unified_profile = unified_service.create_unified_profile(
        username=codeforces_handle or leetcode_handle or codechef_handle,
        platform_profiles=platform_profiles
    )
    
    return _convert_unified_profile_to_dict(unified_profile)


def _convert_unified_profile_to_dict(profile: UnifiedProfile) -> dict:
    """Convert unified profile to a dict for API response."""
    platform_data = {}
    for platform, pp in profile.platforms.items():
        platform_data[platform.value] = {
            "profile": {
                "username": pp.profile.username,
                "platform": pp.profile.platform.value,
                "current_rating": pp.profile.current_rating,
                "max_rating": pp.profile.max_rating,
                "total_solved": pp.profile.total_solved,
            },
            "insights": pp.insights
        }
        
    return {
        "username": profile.username,
        "platforms": platform_data,
        "total_solved": profile.total_solved,
        "skill_score": profile.skill_score,
        "momentum_score": profile.momentum_score,
        "interview_readiness": profile.interview_readiness,
        "growth_potential": profile.growth_potential,
        "strong_topics": profile.strong_topics,
        "weak_topics": profile.weak_topics
    }
