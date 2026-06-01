import pytest

from interview_prep_ai.analytics.strong_topic_analyzer import StrongTopicAnalyzer
from interview_prep_ai.core.models.tag_stat import TagStat


@pytest.fixture
def analyzer() -> StrongTopicAnalyzer:
    return StrongTopicAnalyzer()


def test_empty_tag_stats(analyzer: StrongTopicAnalyzer) -> None:
    assert analyzer.strong_topics([]) == []


def test_fewer_than_three_tags(analyzer: StrongTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=8),
        TagStat(tag="graphs", solved_count=12),
    ]

    assert analyzer.strong_topics(tag_stats) == ["graphs", "dp"]


def test_returns_top_three_by_solved_count(analyzer: StrongTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=12),
        TagStat(tag="graphs", solved_count=20),
        TagStat(tag="greedy", solved_count=5),
        TagStat(tag="math", solved_count=15),
        TagStat(tag="strings", solved_count=1),
    ]

    assert analyzer.strong_topics(tag_stats) == ["graphs", "math", "dp"]


def test_ties_sorted_by_tag_name(analyzer: StrongTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="zebra", solved_count=10),
        TagStat(tag="alpha", solved_count=10),
        TagStat(tag="middle", solved_count=10),
        TagStat(tag="beta", solved_count=5),
    ]

    assert analyzer.strong_topics(tag_stats) == ["alpha", "middle", "zebra"]


def test_exactly_three_tags(analyzer: StrongTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="a", solved_count=1),
        TagStat(tag="b", solved_count=2),
        TagStat(tag="c", solved_count=3),
    ]

    assert analyzer.strong_topics(tag_stats) == ["c", "b", "a"]
