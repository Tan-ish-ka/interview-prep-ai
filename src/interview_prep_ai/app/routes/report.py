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
    from interview_prep_ai.analytics.analyzers.codeforces_analyzer import CodeforcesAnalyzer
    from interview_prep_ai.interview_preparation.platform_prep_engines import CodeforcesPrepEngine
    return UnifiedProfileService(
        insight_generator=CodeforcesAnalyzer(),
        interview_prep_engine=CodeforcesPrepEngine()
    )


from interview_prep_ai.app.auth_deps import get_current_user
from interview_prep_ai.core.models.user import User
from interview_prep_ai.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio

@router.get("/report", response_model=ReportResponse)
async def get_report(
    query: Annotated[ReportQueryParams, Query()],
    service: Annotated[InterviewPrepService, Depends(get_interview_prep_service)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ReportResponse:
    """Generate an interview prep report for a competitive programming profile URL."""
    if not query.url and not query.urls:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Must provide url or urls")
        
    target_urls = [u.strip() for u in query.urls.split(",")] if query.urls else query.url
    report = await asyncio.to_thread(service.generate_report, target_urls)
    
    current_user.reports_generated += 1
    db.add(current_user)
    await db.commit()
    
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
    profile_a = manager.get_profile(url_a, refresh=True)
    profile_b = manager.get_profile(url_b, refresh=True)
    
    # Compare
    return compare_profiles(profile_a, profile_b)


@router.get("/platforms/analysis")
async def get_platform_analysis(
    urls: Annotated[str, Query(description="Comma-separated profile URLs")] = "",
    codeforces_handle: Annotated[str, Query(description="Codeforces handle")] = "",
    leetcode_handle: Annotated[str, Query(description="LeetCode handle")] = "",
    codechef_handle: Annotated[str, Query(description="CodeChef handle")] = "",
    *,
    manager: Annotated[ProfileManager, Depends(get_profile_manager)],
    unified_service: Annotated[UnifiedProfileService, Depends(get_unified_profile_service)],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Generate analysis for multiple platforms."""
    platform_profiles: Dict[Platform, any] = {}
    
    if urls:
        for url in urls.split(","):
            url = url.strip()
            if not url:
                continue
            prof = manager.get_profile(url, refresh=True)
            platform_profiles[prof.platform] = prof
    else:
        # Codeforces
        if codeforces_handle:
            url = f"https://codeforces.com/profile/{codeforces_handle}"
            platform_profiles[Platform.CODEFORCES] = manager.get_profile(url, refresh=True)
            
        # LeetCode
        if leetcode_handle:
            url = f"https://leetcode.com/u/{leetcode_handle}"
            platform_profiles[Platform.LEETCODE] = manager.get_profile(url, refresh=True)
            
        # CodeChef
        if codechef_handle:
            url = f"https://www.codechef.com/users/{codechef_handle}"
            platform_profiles[Platform.CODECHEF] = manager.get_profile(url, refresh=True)
            
    if not platform_profiles:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="No valid profiles provided")
        
    # Create unified profile
    unified_profile = unified_service.create_unified_profile(
        username=codeforces_handle or leetcode_handle or codechef_handle,
        platform_profiles=platform_profiles
    )
    
    current_user.reports_generated += 1
    db.add(current_user)
    await db.commit()
    
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
        "summary": {
            "totalSolved": profile.summary.totalSolved,
            "uniqueSolved": profile.summary.uniqueSolved,
            "contests": profile.summary.contests,
            "interviewReadiness": profile.summary.interviewReadiness,
            "skillScore": profile.summary.skillScore,
            "momentumScore": profile.summary.momentumScore,
            "activityScore": profile.summary.activityScore,
            "strongestPlatform": profile.summary.strongestPlatform,
            "weakestPlatform": profile.summary.weakestPlatform
        },
        "platforms": platform_data,
        "contributions": profile.contributions,
        "topicBreakdown": profile.topicBreakdown,
        "timeline": profile.timeline,
        "aiInsights": {
            "strongest_platform": profile.aiInsights.strongest_platform,
            "weakest_platform": profile.aiInsights.weakest_platform,
            "platform_recommendations": profile.aiInsights.platform_recommendations,
            "topic_gaps": profile.aiInsights.topic_gaps,
            "interview_readiness_explanation": profile.aiInsights.interview_readiness_explanation,
            "activity_observations": profile.aiInsights.activity_observations
        },
        "companyReadiness": profile.companyReadiness
    }

@router.post("/platforms/sync")
def sync_platform(
    platform: Annotated[str, Query(description="Platform name (codeforces, leetcode, codechef)")],
    url: Annotated[str, Query(description="Profile URL or username")],
    manager: Annotated[ProfileManager, Depends(get_profile_manager)],
) -> dict:
    """Sync a single platform and return connection metadata."""
    target_url = url.strip()
    
    # Auto-format URL if just username was provided
    if "://" not in target_url:
        if platform == "codeforces":
            target_url = f"https://codeforces.com/profile/{target_url}"
        elif platform == "leetcode":
            target_url = f"https://leetcode.com/u/{target_url}"
        elif platform == "codechef":
            target_url = f"https://www.codechef.com/users/{target_url}"
            
    try:
        profile = manager.get_profile(target_url, refresh=True)
        return {
            "total_solved": profile.total_solved,
            "total_contests": len(profile.rating_history) if profile.rating_history else 0,
        }
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))

