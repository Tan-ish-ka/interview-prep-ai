from urllib.parse import urlparse

from interview_prep_ai.core.enums import PlatformType


class PlatformDetector:
    _HOSTS: dict[str, PlatformType] = {
        "codeforces.com": PlatformType.CODEFORCES,
        "leetcode.com": PlatformType.LEETCODE,
        "codechef.com": PlatformType.CODECHEF,
    }

    @staticmethod
    def detect(url: str) -> PlatformType:
        host = (urlparse(url).hostname or "").lower()
        if host.startswith("www."):
            host = host[4:]

        for domain, platform in PlatformDetector._HOSTS.items():
            if host == domain or host.endswith(f".{domain}"):
                return platform
        return PlatformType.UNKNOWN
