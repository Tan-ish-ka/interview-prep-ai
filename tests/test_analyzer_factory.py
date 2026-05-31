import pytest

from interview_prep_ai.core.analyzer_factory import AnalyzerFactory
from interview_prep_ai.core.enums import PlatformType
from interview_prep_ai.platforms.codechef.analyzer import CodeChefAnalyzer
from interview_prep_ai.platforms.codeforces.analyzer import CodeforcesAnalyzer
from interview_prep_ai.platforms.leetcode.analyzer import LeetCodeAnalyzer


def test_codeforces_analyzer_returned() -> None:
    analyzer = AnalyzerFactory.get_analyzer(PlatformType.CODEFORCES)
    assert isinstance(analyzer, CodeforcesAnalyzer)


def test_leetcode_analyzer_returned() -> None:
    analyzer = AnalyzerFactory.get_analyzer(PlatformType.LEETCODE)
    assert isinstance(analyzer, LeetCodeAnalyzer)


def test_codechef_analyzer_returned() -> None:
    analyzer = AnalyzerFactory.get_analyzer(PlatformType.CODECHEF)
    assert isinstance(analyzer, CodeChefAnalyzer)


def test_unknown_raises_value_error() -> None:
    with pytest.raises(ValueError, match="No analyzer for platform"):
        AnalyzerFactory.get_analyzer(PlatformType.UNKNOWN)
