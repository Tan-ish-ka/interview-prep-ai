"""OpenRouter provider — unified gateway to 200+ LLMs via OpenAI-compatible API."""

from __future__ import annotations

import os
from typing import AsyncGenerator

from interview_prep_ai.ai_providers import AIProvider


class OpenRouterProvider(AIProvider):
    provider_name = "openrouter"

    # Free/cheap default; users can override
    DEFAULT_MODEL = "google/gemma-3-27b-it:free"
    MODELS_PRIORITY = [
        "anthropic/claude-3.5-sonnet",
        "openai/gpt-4o",
        "google/gemini-2.0-flash-001",
        "google/gemma-3-27b-it:free",
    ]

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ.get("OPENROUTER_API_KEY", "").strip()

    def _client(self):
        from openai import OpenAI  # type: ignore
        if not self._api_key:
            raise RuntimeError("OpenRouter API key is not set.")
        return OpenAI(
            api_key=self._api_key,
            base_url="https://openrouter.ai/api/v1",
        )

    async def stream_chat(
        self, messages: list[dict], *, model: str | None = None
    ) -> AsyncGenerator[str, None]:
        client = self._client()
        models = [model] if model else self.MODELS_PRIORITY

        for m in models:
            try:
                stream = client.chat.completions.create(
                    model=m,
                    messages=messages,  # type: ignore
                    stream=True,
                )
                for chunk in stream:
                    delta = chunk.choices[0].delta.content if chunk.choices else None
                    if delta:
                        yield delta
                return
            except Exception as exc:
                err = str(exc).lower()
                if "model" in err or "not found" in err:
                    continue
                raise

        raise RuntimeError("No available OpenRouter model. Check your key and credits.")

    def test_connection(self) -> tuple[bool, str]:
        try:
            client = self._client()
            client.models.list()
            return True, "✓ OpenRouter key valid"
        except Exception as exc:
            return False, f"✗ {exc}"
