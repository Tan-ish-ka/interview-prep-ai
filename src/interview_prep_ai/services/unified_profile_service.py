"""Service for managing unified competitive programming profile across multiple platforms."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile, merge_profiles
from interview_prep_ai.core.models.tag_stat import TagStat
from interview_prep_ai.analytics.analyzers.base_analyzer import BaseAnalyzer
from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine


@dataclass
class PlatformProfile:
    profile: UserProfile
    insights: dict


@dataclass
class UnifiedSummary:
    totalSolved: int
    uniqueSolved: int
    contests: int
    interviewReadiness: str
    skillScore: int
    momentumScore: int
    activityScore: int
    strongestPlatform: str
    weakestPlatform: str

@dataclass
class AIInsights:
    strongest_platform: str
    weakest_platform: str
    platform_recommendations: str
    topic_gaps: str
    interview_readiness_explanation: str
    activity_observations: str

@dataclass
class UnifiedProfile:
    """Unified profile combining data from all platforms."""
    username: str
    summary: UnifiedSummary
    platforms: Dict[Platform, PlatformProfile]
    contributions: Dict[str, float]
    topicBreakdown: Dict[str, Dict[str, int]]
    timeline: List[Dict]
    aiInsights: AIInsights
    companyReadiness: list


class UnifiedProfileService:
    def __init__(
        self,
        insight_generator: BaseAnalyzer,
        interview_prep_engine: InterviewPrepEngine,
    ):
        self._insight_generator = insight_generator
        self._interview_prep_engine = interview_prep_engine
        
    def create_unified_profile(
        self,
        username: str,
        platform_profiles: Dict[Platform, UserProfile]
    ) -> UnifiedProfile:
        """Create a unified profile from multiple platform profiles."""
        processed_platforms: Dict[Platform, PlatformProfile] = {}
        total_solved = 0
        total_contests = 0
        topic_breakdown: Dict[str, Dict[str, int]] = {}
        
        platform_scores = {}
        total_score = 0
        activity_feed_raw = []
        
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
                tag = tag_stat.tag
                if tag not in topic_breakdown:
                    topic_breakdown[tag] = {"total": 0, "codeforces": 0, "leetcode": 0, "codechef": 0}
                topic_breakdown[tag][platform.value] += tag_stat.solved_count
                topic_breakdown[tag]["total"] += tag_stat.solved_count
                
            # Aggregate contests
            if isinstance(profile.rating_history, dict) and "result" in profile.rating_history:
                total_contests += len(profile.rating_history["result"])
                
            # Heuristic for weighted contributions
            contests_count = len(profile.rating_history.get("result", [])) if isinstance(profile.rating_history, dict) else 0
            rating_bonus = (profile.max_rating / 100) if profile.max_rating else 0
            score = profile.total_solved + rating_bonus + (contests_count * 5)
            platform_scores[platform.value] = score
            total_score += score
            
            # Collect activity feed from submissions
            for sub in profile.all_submissions:
                if sub.submitted_at:
                    activity_feed_raw.append({
                        "type": "submission",
                        "name": sub.problem.title,
                        "verdict": sub.verdict,
                        "platform": platform.value,
                        "timestamp": sub.submitted_at.isoformat(),
                        "_ts": sub.submitted_at.timestamp()
                    })
            
            # Collect activity feed from contests
            if isinstance(profile.rating_history, dict) and "result" in profile.rating_history:
                for contest in profile.rating_history["result"]:
                    if "ratingUpdateTimeSeconds" in contest:
                        from datetime import datetime, timezone
                        ts = contest["ratingUpdateTimeSeconds"]
                        dt = datetime.fromtimestamp(ts, tz=timezone.utc)
                        activity_feed_raw.append({
                            "type": "contest",
                            "name": contest.get("contestName", "Contest"),
                            "verdict": f"Rank {contest.get('rank', 'N/A')}",
                            "platform": platform.value,
                            "timestamp": dt.isoformat(),
                            "_ts": ts
                        })
                
        # Calculate contributions percentages
        contributions = {}
        if total_score > 0:
            for p, s in platform_scores.items():
                contributions[p] = round((s / total_score) * 100, 1)
                
        strongest_platform = max(contributions, key=contributions.get) if contributions else "None"
        weakest_platform = min(contributions, key=contributions.get) if contributions else "None"
        
        # Generate true unified insights using merged profile
        merged_prof = merge_profiles(list(platform_profiles.values()))
        unified_insights = self._insight_generator.generate(merged_prof, merged_prof.rating_history)
        interview_preparation = self._interview_prep_engine.generate(unified_insights)
        company_readiness = interview_preparation.get("company_readiness", [])
        
        skill_score = unified_insights.get("skill_score", 0)
        momentum_score = unified_insights.get("momentum_score", 0)
        interview_readiness = interview_preparation.get("interview_readiness_level", "Developing")
        activity_score = min(100, momentum_score + 10)
        
        summary = UnifiedSummary(
            totalSolved=total_solved,
            uniqueSolved=merged_prof.total_solved, # merged profile dedups problems by title
            contests=total_contests,
            interviewReadiness=interview_readiness,
            skillScore=skill_score,
            momentumScore=momentum_score,
            activityScore=activity_score,
            strongestPlatform=strongest_platform,
            weakestPlatform=weakest_platform
        )
        
        weak_topics = unified_insights.get("weak_topics", [])
        ai_insights = AIInsights(
            strongest_platform=strongest_platform,
            weakest_platform=weakest_platform,
            platform_recommendations="Focus on your weaker platforms to balance your skill set." if len(platform_profiles) > 1 else "Connect more platforms to get cross-platform recommendations.",
            topic_gaps=f"Focus on {', '.join(weak_topics[:3])}" if weak_topics else "No clear gaps detected.",
            interview_readiness_explanation=f"Based on {total_solved} problems and {total_contests} contests across {len(platform_profiles)} platforms.",
            activity_observations="Great consistency" if momentum_score > 50 else "Try to code more consistently"
        )
        
        # Sort and limit activity feed
        activity_feed_raw.sort(key=lambda x: x["_ts"], reverse=True)
        activity_feed = [{k: v for k, v in item.items() if k != "_ts"} for item in activity_feed_raw[:50]]
        
        return UnifiedProfile(
            username=username,
            summary=summary,
            platforms=processed_platforms,
            contributions=contributions,
            topicBreakdown=topic_breakdown,
            timeline=activity_feed,
            aiInsights=ai_insights,
            companyReadiness=company_readiness
        )
