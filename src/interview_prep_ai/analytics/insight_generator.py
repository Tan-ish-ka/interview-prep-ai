"""Aggregate profile insights from rating, problem, and tag analytics."""

from __future__ import annotations

from interview_prep_ai.analytics.activity_analyzer import ActivityAnalyzer
from interview_prep_ai.analytics.contest_analyzer import ContestAnalyzer
from interview_prep_ai.analytics.problem_analyzer import ProblemAnalyzer
from interview_prep_ai.analytics.rating_analyzer import RatingAnalyzer
from interview_prep_ai.analytics.rating_trend_analyzer import RatingTrendAnalyzer
from interview_prep_ai.analytics.insight_scorer import (
    compute_momentum_score,
    compute_skill_score,
)
from interview_prep_ai.analytics.potential_efficiency_analyzer import (
    compute_potential_efficiency,
)
from interview_prep_ai.analytics.strong_topic_analyzer import StrongTopicAnalyzer
from interview_prep_ai.analytics.tag_analyzer import TagAnalyzer
from interview_prep_ai.analytics.weak_topic_analyzer import WeakTopicAnalyzer
from interview_prep_ai.core.models.profile import UserProfile


class InsightGenerator:
    def __init__(
        self,
        *,
        rating_analyzer: RatingAnalyzer | None = None,
        rating_trend_analyzer: RatingTrendAnalyzer | None = None,
        contest_analyzer: ContestAnalyzer | None = None,
        activity_analyzer: ActivityAnalyzer | None = None,
        tag_analyzer: TagAnalyzer | None = None,
        problem_analyzer: ProblemAnalyzer | None = None,
        weak_topic_analyzer: WeakTopicAnalyzer | None = None,
        strong_topic_analyzer: StrongTopicAnalyzer | None = None,
    ) -> None:
        self._rating_analyzer = rating_analyzer or RatingAnalyzer()
        self._rating_trend_analyzer = rating_trend_analyzer or RatingTrendAnalyzer()
        self._contest_analyzer = contest_analyzer or ContestAnalyzer()
        self._activity_analyzer = activity_analyzer or ActivityAnalyzer()
        self._tag_analyzer = tag_analyzer or TagAnalyzer()
        self._problem_analyzer = problem_analyzer or ProblemAnalyzer()
        self._weak_topic_analyzer = weak_topic_analyzer or WeakTopicAnalyzer()
        self._strong_topic_analyzer = strong_topic_analyzer or StrongTopicAnalyzer()

    def generate(self, profile: UserProfile, rating_history: dict) -> dict:
        problems = profile.solved_problems
        tag_frequency = self._tag_analyzer.tag_frequency(problems)
        top_tags = dict(list(tag_frequency.items())[:5])

        strong_topics = self._strong_topic_analyzer.strong_topics(profile.tag_stats)
        weak_topics = self._weak_topic_analyzer.weak_topics(
            profile.tag_stats,
            exclude=set(strong_topics),
        )

        insights = {
            "current_rating": self._rating_analyzer.current_rating(rating_history),
            "max_rating": self._rating_analyzer.max_rating(rating_history),
            "rating_delta": self._rating_analyzer.rating_delta(rating_history),
            "recent_rating_delta": self._rating_trend_analyzer.recent_rating_delta(
                rating_history
            ),
            "rating_trend": self._rating_trend_analyzer.rating_trend(rating_history),
            "contest_stats": self._contest_analyzer.contest_stats(rating_history),
            "activity_stats": self._activity_analyzer.activity_stats(problems),
            "total_solved": self._problem_analyzer.total_solved(problems),
            "recent_activity": self._problem_analyzer.recent_activity(problems),
            "top_tags": top_tags,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
        }
        insights["skill_score"] = compute_skill_score(insights)
        insights["momentum_score"] = compute_momentum_score(insights)
        insights["potential_efficiency"] = compute_potential_efficiency(insights)
        return insights
