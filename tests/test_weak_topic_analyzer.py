import pytest

from interview_prep_ai.analytics.weak_topic_analyzer import WeakTopicAnalyzer
from interview_prep_ai.core.models.tag_stat import TagStat


@pytest.fixture
def analyzer() -> WeakTopicAnalyzer:
    return WeakTopicAnalyzer()


def test_empty_tag_stats(analyzer: WeakTopicAnalyzer) -> None:
    assert analyzer.weak_topics([]) == []


def test_no_weak_topics_when_all_above_relative_threshold(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=10),
        TagStat(tag="graphs", solved_count=10),
    ]

    assert analyzer.weak_topics(tag_stats) == []


def test_zero_solve_count_excluded(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=0),
        TagStat(tag="graphs", solved_count=2),
    ]

    assert analyzer.weak_topics(tag_stats) == ["graphs"]


def test_single_tag_at_or_above_floor_not_weak(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [TagStat(tag="dp", solved_count=5)]

    assert analyzer.weak_topics(tag_stats) == []


def test_returns_relative_weak_topics(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="dp", solved_count=12),
        TagStat(tag="graphs", solved_count=3),
        TagStat(tag="greedy", solved_count=5),
        TagStat(tag="math", solved_count=1),
    ]

    assert analyzer.weak_topics(tag_stats) == ["math", "graphs"]


def test_sorted_by_solved_count_ascending(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="strings", solved_count=2),
        TagStat(tag="graphs", solved_count=1),
        TagStat(tag="dp", solved_count=20),
        TagStat(tag="math", solved_count=3),
    ]

    assert analyzer.weak_topics(tag_stats) == ["graphs", "strings", "math"]


def test_capped_at_five(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [TagStat(tag=f"tag{i}", solved_count=i) for i in range(1, 10)]
    tag_stats.append(TagStat(tag="anchor", solved_count=100))

    assert len(analyzer.weak_topics(tag_stats)) == 5


def test_excludes_strong_topics(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="strong_a", solved_count=32),
        TagStat(tag="strong_b", solved_count=21),
        TagStat(tag="borderline", solved_count=10),
    ]

    assert analyzer.weak_topics(tag_stats, exclude={"borderline"}) == []


def test_ties_sorted_by_tag_name(analyzer: WeakTopicAnalyzer) -> None:
    tag_stats = [
        TagStat(tag="zebra", solved_count=1),
        TagStat(tag="alpha", solved_count=1),
        TagStat(tag="middle", solved_count=1),
        TagStat(tag="anchor", solved_count=20),
    ]

    assert analyzer.weak_topics(tag_stats) == ["alpha", "middle", "zebra"]
