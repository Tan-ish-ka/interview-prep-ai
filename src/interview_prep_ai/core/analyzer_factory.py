from interview_prep_ai.api.codeforces_client import CodeforcesClient
from interview_prep_ai.core.enums import PlatformType
from interview_prep_ai.core.interfaces.platform_analyzer import IPlatformAnalyzer
from interview_prep_ai.platforms.codechef.analyzer import CodeChefAnalyzer
from interview_prep_ai.platforms.codeforces.analyzer import CodeforcesAnalyzer
from interview_prep_ai.platforms.leetcode.analyzer import LeetCodeAnalyzer


class AnalyzerFactory:
    @staticmethod
    def get_analyzer(
        platform: PlatformType,
        *,
        codeforces_client: CodeforcesClient | None = None,
    ) -> IPlatformAnalyzer:
        match platform:
            case PlatformType.CODEFORCES:
                return CodeforcesAnalyzer(codeforces_client=codeforces_client)
            case PlatformType.LEETCODE:
                return LeetCodeAnalyzer()
            case PlatformType.CODECHEF:
                return CodeChefAnalyzer()
            case _:
                raise ValueError(f"No analyzer for platform: {platform}")
