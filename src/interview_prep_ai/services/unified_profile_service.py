"""Service for managing unified competitive programming profile across multiple platforms."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.analytics.insight_generator import InsightGenerator
from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine


@dataclass
class PlatformProfile:
    profile: UserProfile
    insights: dict


@dataclass
class UnifiedProfile:
    """Unified profile combining data from all platforms."""
    username: str
    platforms: Dict[Platform, PlatformProfile]
    total_solved: int
    combined_tag_stats: List[TagStat]
    skill_score: int
    momentum_score: int
    interview_readiness: str
    growth_potential: str
    strong_topics: List[str]
    weak_topics: List[str]


class UnifiedProfileService:
    def __init__(
        self,
        insight_generator: InsightGenerator | None = None,
        interview_prep_engine: InterviewPrepEngine | None = None
    ) -> None:
        self._insight_generator = insight_generator or InsightGenerator()
        self._interview_engine = interview_prep_engine or InterviewPrepEngine()
        
    def create_unified_profile(
        self,
        username: str,
        platform_profiles: Dict[Platform, UserProfile]
    ) -> UnifiedProfile:
        """Create a unified profile from multiple platform profiles."""
        processed_platforms: Dict[Platform, PlatformProfile] = {}
        total_solved = 0
        tag_counts: Dict[str, int] = {}
        
        # Process each platform profile
        for platform, profile in platform_profiles.items():
            insights = self._insight_generator.generate(profile, profile.rating_history)
            processed_platforms[platform] = PlatformProfile(
                profile=profile,
                insights=insights
            )
            total_solved += profile.total_solved
            
            # Aggregate tag stats
            for tag_stat in profile.tag_stats:
                tag_counts[tag_stat.tag] = tag_counts.get(tag_stat.tag, 0) + tag_stat.solved_count
                
        # Create combined tag stats
        combined_tag_stats = [
            TagStat(tag=tag, solved_count=count, attempt_count=0)
            for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1])
        ]
        
        # Get overall insights (using first platform for now, can be improved later)
        # For mock, we'll aggregate skill/momentum scores
        if processed_platforms:
            first_platform = next(iter(processed_platforms.values()))
            skill_score = first_platform.insights.get("skill_score", 0)
            momentum_score = first_platform.insights.get("momentum_score", 0)
            interview_readiness = first_platform.profile.username  # Temporary, will use real interview prep
            growth_potential = first_platform.insights.get("potential_efficiency", {}).get("growth_potential", "")
            strong_topics = first_platform.insights.get("strong_topics", [])
            weak_topics = first_platform.insights.get("weak_topics", [])
        else:
            skill_score = 0
            momentum_score = 0
            interview_readiness = "Developing"
            growth_potential = "Moderate"
            strong_topics = []
            weak_topics = []
            
        return UnifiedProfile(
            username=username,
            platforms=processed_platforms,
            total_solved=total_solved,
            combined_tag_stats=combined_tag_stats,
            skill_score=skill_score,
            momentum_score=momentum_score,
            interview_readiness=interview_readiness,
            growth_potential=growth_potential,
            strong_topics=strong_topics,
            weak_topics=weak_topics
        )
