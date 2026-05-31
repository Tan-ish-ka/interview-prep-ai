from interview_prep_ai.core.enums import PlatformType
from interview_prep_ai.core.platform_detector import PlatformDetector


def test_codeforces_url_detection() -> None:
    url = "https://codeforces.com/profile/tourist"
    assert PlatformDetector.detect(url) == PlatformType.CODEFORCES


def test_leetcode_url_detection() -> None:
    url = "https://leetcode.com/u/abc/"
    assert PlatformDetector.detect(url) == PlatformType.LEETCODE


def test_codechef_url_detection() -> None:
    url = "https://www.codechef.com/users/xyz"
    assert PlatformDetector.detect(url) == PlatformType.CODECHEF


def test_unknown_url_detection() -> None:
    url = "https://example.com/profile/user"
    assert PlatformDetector.detect(url) == PlatformType.UNKNOWN
