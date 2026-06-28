"""OpenAI provider — uses the openai SDK Responses API with streaming."""

from __future__ import annotations

import os
from typing import AsyncGenerator

from interview_prep_ai.ai_providers import AIProvider


class OpenAIProvider(AIProvider):
    provider_name = "openai"

    MODELS_PRIORITY = ["gpt-4.1", "gpt-4o", "gpt-4o-mini"]

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ.get("OPENAI_API_KEY", "").strip()

    def _client(self):
        from openai import OpenAI  # type: ignore
        if not self._api_key:
            raise RuntimeError("OpenAI API key is not set.")
        return OpenAI(api_key=self._api_key)

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
                if "model" in err or "not found" in err or "does not exist" in err:
                    continue
                raise

        raise RuntimeError("No available OpenAI model found. Check your API access.")

    def test_connection(self) -> tuple[bool, str]:
        try:
            client = self._client()
            # Lightweight request to verify key
            client.models.list()
            return True, "✓ OpenAI key valid"
        except Exception as exc:
            return False, f"✗ {exc}"
