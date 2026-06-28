from __future__ import annotations

from unittest.mock import patch, MagicMock
import pytest
pytestmark = pytest.mark.skip(reason="Needs update after AI service architecture refactor")

from fastapi.testclient import TestClient
from interview_prep_ai.app.main import create_app

from interview_prep_ai.app.auth_deps import get_current_user
from interview_prep_ai.repositories.user_repository import User

def mock_get_current_user():
    return User(
        id="12345",
        username="test_user",
        email="test@example.com",
        plan="free"
    )

@pytest.fixture
def client():
    app = create_app()
    app.dependency_overrides[get_current_user] = mock_get_current_user
    return TestClient(app)

def test_coach_chat_requires_api_key_or_fails(client):
    payload = {
        "message": "Hello Coach",
        "profile": {
            "username": "test_user",
            "platform": "Codeforces",
            "current_rating": 1500,
            "max_rating": 1600,
            "total_solved": 100
        },
        "insights": {
            "current_rating": 1500,
            "max_rating": 1600,
            "rating_delta": 50,
            "recent_rating_delta": 20,
            "rating_trend": "stable",
            "contest_stats": {},
            "activity_stats": {},
            "total_solved": 100,
            "recent_activity": 10,
            "top_tags": {"dp": 10},
            "weak_topics": ["Graphs"],
            "strong_topics": ["Math"],
            "skill_score": 75,
            "momentum_score": 80,
            "potential_efficiency": {},
            "ai_insight": None
        },
        "recommendations": ["Solve dynamic programming problems"],
        "interview_preparation": {
            "interview_readiness_level": "Intermediate",
            "interview_focus_areas": [],
            "roadmap": [],
            "company_readiness": []
        },
        "conversation": []
    }
    
    with patch("interview_prep_ai.app.routes.coach.os.environ", {"OPENAI_API_KEY": ""}):
        response = client.post("/coach/chat", json=payload)
        assert response.status_code == 200
        text = response.text
        assert "error" in text
        assert "OPENAI_API_KEY is not set" in text

def test_coach_chat_streaming_success(client):
    payload = {
        "message": "Hello Coach",
        "profile": {
            "username": "test_user",
            "platform": "Codeforces",
            "current_rating": 1500,
            "max_rating": 1600,
            "total_solved": 100
        },
        "insights": {
            "current_rating": 1500,
            "max_rating": 1600,
            "rating_delta": 50,
            "recent_rating_delta": 20,
            "rating_trend": "stable",
            "contest_stats": {},
            "activity_stats": {},
            "total_solved": 100,
            "recent_activity": 10,
            "top_tags": {"dp": 10},
            "weak_topics": ["Graphs"],
            "strong_topics": ["Math"],
            "skill_score": 75,
            "momentum_score": 80,
            "potential_efficiency": {},
            "ai_insight": None
        },
        "recommendations": [],
        "interview_preparation": {
            "interview_readiness_level": "Intermediate",
            "interview_focus_areas": [],
            "roadmap": [],
            "company_readiness": []
        },
        "conversation": []
    }

    mock_openai_instance = MagicMock()
    
    mock_stream_ctx = MagicMock()
    mock_stream = MagicMock()
    mock_stream.text_stream = ["Hello", " user,", " how", " can", " I", " help?"]
    
    mock_stream_ctx.__enter__.return_value = mock_stream
    mock_openai_instance.responses.stream.return_value = mock_stream_ctx

    with patch("interview_prep_ai.app.routes.coach._get_openai_client", return_value=mock_openai_instance):
        response = client.post("/coach/chat", json=payload)
        assert response.status_code == 200
        assert "text" in response.text
        assert "Hello" in response.text
        assert "help?" in response.text
