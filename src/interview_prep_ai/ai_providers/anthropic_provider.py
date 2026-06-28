"""Anthropic Claude provider — uses the anthropic SDK with streaming."""

from __future__ import annotations

import os
from typing import AsyncGenerator

from interview_prep_ai.ai_providers import AIProvider


class AnthropicProvider(AIProvider):
    provider_name = "anthropic"

    DEFAULT_MODEL = "claude-3-5-sonnet-20241022"

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ.get("ANTHROPIC_API_KEY", "").strip()

    async def stream_chat(
        self, messages: list[dict], *, model: str | None = None
    ) -> AsyncGenerator[str, None]:
        try:
            import anthropic  # type: ignore
        except ImportError:
            raise RuntimeError(
                "anthropic package not installed. Run: pip install anthropic"
            )

        if not self._api_key:
            raise RuntimeError("Anthropic API key is not set.")

        client = anthropic.Anthropic(api_key=self._api_key)
        model_name = model or self.DEFAULT_MODEL

        # Extract system prompt (Anthropic has a dedicated system param)
        system_text = ""
        chat_messages = []
        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                system_text = content
            else:
                chat_messages.append({"role": role, "content": content})

        kwargs: dict = {
            "model": model_name,
            "max_tokens": 4096,
            "messages": chat_messages,
        }
        if system_text:
            kwargs["system"] = system_text

        with client.messages.stream(**kwargs) as stream:
            for text in stream.text_stream:
                if text:
                    yield text

    def test_connection(self) -> tuple[bool, str]:
        try:
            import anthropic  # type: ignore
            if not self._api_key:
                return False, "✗ Anthropic API key not set"
            client = anthropic.Anthropic(api_key=self._api_key)
            client.models.list()
            return True, "✓ Anthropic key valid"
        except Exception as exc:
            return False, f"✗ {exc}"
