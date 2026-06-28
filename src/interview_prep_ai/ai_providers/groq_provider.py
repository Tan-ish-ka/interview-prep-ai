"""Groq provider — OpenAI-compatible API with ultra-fast Llama/Mixtral models."""

from __future__ import annotations

import os
from typing import AsyncGenerator

from interview_prep_ai.ai_providers import AIProvider


class GroqProvider(AIProvider):
    provider_name = "groq"

    DEFAULT_MODEL = "llama-3.3-70b-versatile"
    MODELS_PRIORITY = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ.get("GROQ_API_KEY", "").strip()

    def _client(self):
        # Groq uses the OpenAI-compatible API
        from openai import OpenAI  # type: ignore
        if not self._api_key:
            raise RuntimeError("Groq API key is not set.")
        return OpenAI(
            api_key=self._api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    async def stream_chat(
        self, messages: list[dict], *, model: str | None = None
    ) -> AsyncGenerator[str, None]:
        client = self._client()
        model_name = model or self.DEFAULT_MODEL

        # Groq uses the standard OpenAI Chat Completions
        stream = client.chat.completions.create(
            model=model_name,
            messages=messages,  # type: ignore
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                yield delta

    def test_connection(self) -> tuple[bool, str]:
        try:
            client = self._client()
            client.models.list()
            return True, "✓ Groq key valid"
        except Exception as exc:
            return False, f"✗ {exc}"
