"""Orchestrates profile loading, insight generation, and recommendations."""

from __future__ import annotations

from typing import Any

from interview_prep_ai.analytics.analyzers.codeforces_analyzer import CodeforcesAnalyzer
from interview_prep_ai.analytics.analyzers.leetcode_analyzer import LeetCodeAnalyzer as LeetCodeInsightGenerator
from interview_prep_ai.analytics.analyzers.codechef_analyzer import CodeChefAnalyzer as CodeChefInsightGenerator
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.interview_preparation.interview_prep_engine import InterviewPrepEngine
from interview_prep_ai.recommendations.recommendation_service import RecommendationService
from interview_prep_ai.services.profile_manager import ProfileManager
from interview_prep_ai.analytics.submission_intelligence import SubmissionIntelligenceEngine
from interview_prep_ai.analytics.root_cause_engine import RootCauseEngine
from interview_prep_ai.analytics.learning_dna_engine import LearningDNAEngine
from interview_prep_ai.analytics.hidden_potential_engine import HiddenPotentialEngine
from interview_prep_ai.analytics.contest_replay_analyzer import ContestReplayAnalyzer
from interview_prep_ai.analytics.missed_opportunity_detector import MissedOpportunityDetector

from interview_prep_ai.interview_preparation.platform_prep_engines import CodeforcesPrepEngine, LeetCodePrepEngine, CodeChefPrepEngine

class InterviewPrepService:
    def __init__(
        self,
        *,
        profile_manager: ProfileManager,
        recommendation_service: RecommendationService,
    ) -> None:
        self._profile_manager = profile_manager
        self._recommendation_service = recommendation_service

    def _get_engines(self, platform: Platform):
        if platform == Platform.LEETCODE:
            return LeetCodeInsightGenerator(), LeetCodePrepEngine()
        elif platform == Platform.CODECHEF:
            return CodeChefInsightGenerator(), CodeChefPrepEngine()
        return CodeforcesAnalyzer(), CodeforcesPrepEngine()

    def generate_report(self, url: str | list[str]) -> dict[str, Any]:
        urls = [url] if isinstance(url, str) else url
        
        # Load individual profiles
        platform_profiles = {}
        from interview_prep_ai.core.models.profile import merge_profiles
        
        for single_url in urls:
            try:
                prof = self._profile_manager.get_profile(single_url, refresh=True)
                platform_profiles[prof.platform] = prof
            except Exception as e:
                print(f"Error loading {single_url}: {e}")
                
        # Generate unified profile to extract advanced stats
        from interview_prep_ai.services.unified_profile_service import UnifiedProfileService
        
        # Determine the primary platform if single URL, else Unified
        primary_platform = list(platform_profiles.values())[0].platform if len(platform_profiles) == 1 else Platform.UNIFIED
        analyzer, engine = self._get_engines(primary_platform)
        
        unified_service = UnifiedProfileService(analyzer, engine)
        username = " + ".join([p.username for p in platform_profiles.values()]) if platform_profiles else "Unknown"
        unified_prof = unified_service.create_unified_profile(username, platform_profiles)
        
        # We still need the merged UserProfile for existing engines
        profile = merge_profiles(list(platform_profiles.values()))
        
        # Generate standard insights for the merged profile
        insights = analyzer.generate(profile, profile.rating_history)
        recommendations = self._recommendation_service.generate(insights)
        interview_preparation = engine.generate(insights)
        
        submission_intelligence = SubmissionIntelligenceEngine.analyze(profile)
        root_causes = RootCauseEngine.infer(profile, submission_intelligence)
        learning_dna = LearningDNAEngine.infer(profile, insights, submission_intelligence)
        hidden_potential = HiddenPotentialEngine.calculate(profile, insights, submission_intelligence)
        contest_replays = ContestReplayAnalyzer.analyze(profile)
        missed_opportunities = MissedOpportunityDetector.detect(profile, insights, contest_replays)
        
        failure_intelligence = {
            **submission_intelligence,
            "root_causes": root_causes,
        }
        
        return {
            "profile": profile,
            "insights": insights,
            "recommendations": recommendations,
            "interview_preparation": interview_preparation,
            "failure_intelligence": failure_intelligence,
            "learning_dna": learning_dna,
            "hidden_potential": hidden_potential,
            "contest_replays": contest_replays,
            "missed_opportunities": missed_opportunities,
            "contributions": unified_prof.contributions,
            "activity_feed": unified_prof.timeline,
            "skill_matrix": {k: sum(v.values()) for k, v in unified_prof.topicBreakdown.items()},
        }
