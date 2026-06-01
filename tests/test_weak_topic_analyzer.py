import pytest

from interview_prep_ai.analytics.weak_topic_analyzer import WeakTopicAnalyzer
from interview_prep_ai.core.models.tag_stat import TagStat


@pytest.fixture
def analyzer() -> WeakTopicAnalyzer:
    return WeakTopicAnalyzer()


def test_empty_tag_stats(analyzer: WeakTopicAnalyzer) -> None:
    assert analyzer.weak_topics([]) == []


def test_no_weak_topics_when_all_at_threshold(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=5),
        TagStat(tag="graphs", solved_count=10),
    ]

    assert analyzer.weak_topics(tag_stats) == []


def test_solved_count_at_threshold_is_not_weak(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [TagStat(tag="dp", solved_count=5)]

    assert analyzer.weak_topics(tag_stats) == []


def test_solved_count_below_threshold_is_weak(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [TagStat(tag="greedy", solved_count=4)]

    assert analyzer.weak_topics(tag_stats) == ["greedy"]


def test_returns_only_weak_topics(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=12),
        TagStat(tag="graphs", solved_count=3),
        TagStat(tag="greedy", solved_count=5),
        TagStat(tag="math", solved_count=1),
    ]

    assert analyzer.weak_topics(tag_stats) == ["math", "graphs"]


def test_sorted_by_solved_count_ascending(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="strings", solved_count=4),
        TagStat(tag="math", solved_count=0),
        TagStat(tag="graphs", solved_count=2),
        TagStat(tag="dp", solved_count=4),
    ]

    assert analyzer.weak_topics(tag_stats) == ["math", "graphs", "dp", "strings"]


def test_ties_sorted_by_tag_name(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="zebra", solved_count=2),
        TagStat(tag="alpha", solved_count=2),
        TagStat(tag="middle", solved_count=2),
    ]

    assert analyzer.weak_topics(tag_stats) == ["alpha", "middle", "zebra"]
