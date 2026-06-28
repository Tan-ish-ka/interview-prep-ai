from unittest.mock import MagicMock, patch

import pytest
pytestmark = pytest.mark.skip(reason="Needs update after unified profile architecture")
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.services.interview_prep_service import InterviewPrepService

@pytest.fixture
def url() -> str:
    return "https://codeforces.com/profile/tourist"


@pytest.fixture
def profile() -> UserProfile:
    return UserProfile(
        username="tourist",
        platform=Platform.CODEFORCES,
        current_rating=3858,
        max_rating=3919,
        rating_history={
            "status": "OK",
            "result": [
                {"oldRating": 3800, "newRating": 3858},
                {"oldRating": 3858, "newRating": 3919},
            ],
        },
    )


@pytest.fixture
def insights() -> dict:
    return {
        "current_rating": 3858,
        "max_rating": 3919,
        "rating_delta": None,
        "total_solved": 42,
        "recent_activity": 5,
        "top_tags": {"dp": 10, "graphs": 8},
    }


@pytest.fixture
def recommendations() -> list[str]:
    return [
        "Increase your practice consistency — aim for more regular solving sessions.",
    ]


@pytest.fixture
def mock_profile_manager(profile: UserProfile) -> MagicMock:
    manager = MagicMock()
    manager.get_profile.return_value = profile
    return manager


@pytest.fixture
def mock_insight_generator(insights: dict) -> MagicMock:
    generator = MagicMock()
    generator.generate.return_value = insights
    return generator


@pytest.fixture
def mock_recommendation_service(recommendations: list[str]) -> MagicMock:
    service = MagicMock()
    service.generate.return_value = recommendations
    return service


@pytest.fixture
def interview_preparation() -> dict:
    return {
        "interview_readiness_level": "Interview Ready",
        "interview_focus_areas": [
            {"area": "Dynamic Programming", "status": "strong", "solved_count": 10},
        ],
        "roadmap": [
            {
                "priority": 1,
                "category": "mock_interview",
                "title": "Schedule mock interview rounds",
                "description": "Run 2 mock interviews per week.",
            },
        ],
        "company_readiness": [
            {
                "company": "Google",
                "category": "Big Tech",
                "score": 68,
                "level": "Nearly Ready",
                "reason": "Focus next on Graphs for this company's interview track.",
                "strong_topics": ["Graphs", "DP"],
                "missing_topics": ["Math", "Trees"],
            },
        ],
    }


@pytest.fixture
def mock_interview_prep_engine(interview_preparation: dict) -> MagicMock:
    engine = MagicMock()
    engine.generate.return_value = interview_preparation
    return engine


@pytest.fixture
def interview_prep_service(
    mock_profile_manager: MagicMock,
    mock_recommendation_service: MagicMock,
) -> InterviewPrepService:
    service = InterviewPrepService(
        profile_manager=mock_profile_manager,
        recommendation_service=mock_recommendation_service,
    )
    return service


def test_profile_manager_called(
    interview_prep_service: InterviewPrepService,
    mock_profile_manager: MagicMock,
    url: str,
) -> None:
    # Need to mock the engines to avoid actual execution
    with patch.object(interview_prep_service, "_get_engines") as mock_get_engines:
        mock_analyzer = MagicMock()
        mock_analyzer.generate.return_value = {}
        mock_engine = MagicMock()
        mock_engine.generate.return_value = {}
        mock_get_engines.return_value = (mock_analyzer, mock_engine)
        
        interview_prep_service.generate_report(url)

        mock_profile_manager.get_profile.assert_called_once_with(url, refresh=True)


def test_insight_generator_called(
    interview_prep_service: InterviewPrepService,
    profile: UserProfile,
    url: str,
) -> None:
    with patch.object(interview_prep_service, "_get_engines") as mock_get_engines:
        mock_analyzer = MagicMock()
        mock_analyzer.generate.return_value = {}
        mock_engine = MagicMock()
        mock_engine.generate.return_value = {}
        mock_get_engines.return_value = (mock_analyzer, mock_engine)

        interview_prep_service.generate_report(url)

        mock_analyzer.generate.assert_called_once()
        call_args = mock_analyzer.generate.call_args
        assert call_args[0][0] is profile


def test_recommendation_service_called(
    interview_prep_service: InterviewPrepService,
    mock_recommendation_service: MagicMock,
    insights: dict,
    url: str,
) -> None:
    with patch.object(interview_prep_service, "_get_engines") as mock_get_engines:
        mock_analyzer = MagicMock()
        mock_analyzer.generate.return_value = insights
        mock_engine = MagicMock()
        mock_engine.generate.return_value = {}
        mock_get_engines.return_value = (mock_analyzer, mock_engine)
        
        interview_prep_service.generate_report(url)

        mock_recommendation_service.generate.assert_called_once_with(insights)


def test_interview_prep_engine_called(
    interview_prep_service: InterviewPrepService,
    insights: dict,
    url: str,
) -> None:
    with patch.object(interview_prep_service, "_get_engines") as mock_get_engines:
        mock_analyzer = MagicMock()
        mock_analyzer.generate.return_value = insights
        mock_engine = MagicMock()
        mock_engine.generate.return_value = {}
        mock_get_engines.return_value = (mock_analyzer, mock_engine)
        
        interview_prep_service.generate_report(url)

        mock_engine.generate.assert_called_once_with(insights)


def test_returned_report_contains_expected_keys(
    interview_prep_service: InterviewPrepService,
    profile: UserProfile,
    insights: dict,
    recommendations: list[str],
    interview_preparation: dict,
    url: str,
) -> None:
    with patch.object(interview_prep_service, "_get_engines") as mock_get_engines:
        mock_analyzer = MagicMock()
        mock_analyzer.generate.return_value = insights
        mock_engine = MagicMock()
        mock_engine.generate.return_value = interview_preparation
        mock_get_engines.return_value = (mock_analyzer, mock_engine)
        
        report = interview_prep_service.generate_report(url)

        assert report["profile"] is profile
        assert report["insights"] is insights
        assert report["recommendations"] is recommendations
        assert report["interview_preparation"] is interview_preparation
