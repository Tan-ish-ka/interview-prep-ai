"""Integration tests for the report HTTP API."""

from __future__ import annotations

from unittest.mock import MagicMock, AsyncMock

import pytest
from fastapi.testclient import TestClient

from interview_prep_ai.app.main import create_app
from interview_prep_ai.app.routes.report import get_interview_prep_service
from interview_prep_ai.app.auth_deps import get_current_user
from interview_prep_ai.database import get_db
from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.profile import UserProfile
from interview_prep_ai.services.interview_prep_service import InterviewPrepService
from interview_prep_ai.services.profile_service import UnsupportedPlatformError
from interview_prep_ai.repositories.user_repository import User

def mock_get_current_user():
    return User(
        id="12345",
        username="test_user",
        email="test@example.com",
        plan="free",
        reports_generated=0
    )


@pytest.fixture
def profile_url() -> str:
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
            "result": [{"oldRating": 3800, "newRating": 3858}],
        },
    )


@pytest.fixture
def service_report(profile: UserProfile) -> dict:
    return {
        "profile": profile,
        "insights": {
            "current_rating": 3858,
            "max_rating": 3919,
            "rating_delta": 58,
            "recent_rating_delta": 61,
            "rating_trend": "improving",
            "contest_stats": {
                "total_contests": 120,
                "contests_last_30_days": 3,
                "average_rating_change": 12.5,
            },
            "activity_stats": {
                "problems_last_30_days": 8,
                "problems_last_90_days": 20,
                "average_problems_per_week": 1.56,
            },
            "total_solved": 42,
            "recent_activity": 5,
            "top_tags": {"dp": 10},
            "weak_topics": ["graphs", "greedy"],
            "strong_topics": ["dp", "graphs", "greedy"],
            "skill_score": 85,
            "momentum_score": 45,
        },
        "recommendations": [
            "Increase your practice consistency — aim for more regular solving sessions.",
        ],
        "interview_preparation": {
            "interview_readiness_level": "Interview Ready",
            "interview_focus_areas": [
                {"area": "Dynamic Programming", "status": "strong", "solved_count": 10},
            ],
            "roadmap": [
                {
                    "priority": 1,
                    "category": "weak_topic_practice",
                    "title": "Strengthen weak interview topics",
                    "description": "Prioritize company-style problems in: Graphs.",
                },
            ],
            "company_readiness": [
                {
                    "company": "Amazon",
                    "category": "Big Tech",
                    "overall_readiness": 74,
                    "score": 74,
                    "level": "Ready",
                    "reason": "Strong fit in Dynamic Programming with solid overall coverage.",
                    "strong_topics": ["DP", "Arrays"],
                    "missing_topics": ["Trees"],
                },
            ],
        },
    }


@pytest.fixture
def mock_interview_prep_service(
    service_report: dict,
    profile_url: str,
) -> MagicMock:
    service = MagicMock(spec=InterviewPrepService)
    service.generate_report.return_value = service_report
    return service


@pytest.fixture
def client(mock_interview_prep_service: MagicMock) -> TestClient:
    app = create_app()
    app.dependency_overrides[get_interview_prep_service] = (
        lambda: mock_interview_prep_service
    )
    
    # Mock DB session so it doesn't fail on db.commit()
    mock_db = MagicMock()
    mock_db.commit = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_db
    
    app.dependency_overrides[get_current_user] = mock_get_current_user
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_get_report_returns_200_and_json_body(
    client: TestClient,
    mock_interview_prep_service: MagicMock,
    profile_url: str,
    profile: UserProfile,
) -> None:
    response = client.get("/report", params={"url": profile_url})

    print(response.json())
    assert response.status_code == 200
    body = response.json()
    mock_interview_prep_service.generate_report.assert_called_once_with(profile_url)
    assert body["profile"]["username"] == profile.username
    assert body["profile"]["platform"] == profile.platform.value
    assert body["profile"]["current_rating"] == profile.current_rating
    assert body["insights"]["current_rating"] == 3858
    assert body["insights"]["total_solved"] == 42
    assert body["insights"]["recent_rating_delta"] == 61
    assert body["insights"]["rating_trend"] == "improving"
    assert body["insights"]["contest_stats"] == {
        "total_contests": 120,
        "contests_last_30_days": 3,
        "average_rating_change": 12.5,
    }
    assert body["insights"]["activity_stats"] == {
        "problems_last_30_days": 8,
        "problems_last_90_days": 20,
        "average_problems_per_week": 1.56,
    }
    assert body["insights"]["weak_topics"] == ["graphs", "greedy"]
    assert body["insights"]["strong_topics"] == ["dp", "graphs", "greedy"]
    assert len(body["recommendations"]) == 1
    assert body["interview_preparation"]["interview_readiness_level"] == "Interview Ready"
    assert len(body["interview_preparation"]["roadmap"]) == 1
    assert body["interview_preparation"]["company_readiness"][0]["company"] == "Amazon"


def test_get_report_missing_url_returns_422(client: TestClient) -> None:
    response = client.get("/report")

    assert response.status_code == 400
    assert "detail" in response.json()


def test_get_report_invalid_url_scheme_returns_422(client: TestClient) -> None:
    response = client.get("/report", params={"url": "ftp://codeforces.com/profile/tourist"})

    assert response.status_code == 422
    assert "detail" in response.json()


def test_get_report_unsupported_platform_returns_400(
    client: TestClient,
    mock_interview_prep_service: MagicMock,
) -> None:
    invalid_url = "https://example.com/profile/user"
    mock_interview_prep_service.generate_report.side_effect = UnsupportedPlatformError(
        f"Unsupported platform for URL: {invalid_url}"
    )

    response = client.get("/report", params={"url": invalid_url})

    assert response.status_code == 400
    assert invalid_url in response.json()["detail"]


def test_get_report_value_error_returns_400(
    client: TestClient,
    mock_interview_prep_service: MagicMock,
    profile_url: str,
) -> None:
    mock_interview_prep_service.generate_report.side_effect = ValueError(
        f"Cannot extract Codeforces handle from URL: {profile_url}"
    )

    response = client.get("/report", params={"url": profile_url})

    assert response.status_code == 400
    assert "Cannot extract" in response.json()["detail"]
