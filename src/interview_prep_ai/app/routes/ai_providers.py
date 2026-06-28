"""AI provider management routes — test connection, list providers."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from interview_prep_ai.ai_providers.factory import ProviderFactory

router = APIRouter(prefix="/ai", tags=["ai-providers"])


class TestConnectionRequest(BaseModel):
    provider: str = Field(default="openai")
    api_key: str = Field(default="")


class TestConnectionResponse(BaseModel):
    success: bool
    message: str
    provider: str


@router.post("/test-connection", response_model=TestConnectionResponse)
def test_connection(req: TestConnectionRequest) -> TestConnectionResponse:
    """Test if a provider API key is valid."""
    provider_inst = ProviderFactory.create(req.provider, api_key=req.api_key or None)
    success, message = provider_inst.test_connection()
    return TestConnectionResponse(success=success, message=message, provider=req.provider)


@router.get("/providers")
def list_providers() -> dict:
    """List all available AI providers."""
    return {"providers": ProviderFactory.available_providers()}
