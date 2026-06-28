"""Gemini provider — uses google-generativeai SDK with streaming."""

from __future__ import annotations

import os
from typing import AsyncGenerator

from interview_prep_ai.ai_providers import AIProvider


class GeminiProvider(AIProvider):
    provider_name = "gemini"

    DEFAULT_MODEL = "gemini-2.0-flash"

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or os.environ.get("GEMINI_API_KEY", "").strip()

    async def stream_chat(
        self, messages: list[dict], *, model: str | None = None
    ) -> AsyncGenerator[str, None]:
        try:
            import google.generativeai as genai  # type: ignore
        except ImportError:
            raise RuntimeError(
                "google-generativeai package not installed. "
                "Run: pip install google-generativeai"
            )

        if not self._api_key:
            raise RuntimeError("Gemini API key is not set.")

        genai.configure(api_key=self._api_key)
        model_name = model or self.DEFAULT_MODEL

        # Convert OpenAI-style messages to Gemini format
        # System prompt → prepend to first user message
        system_content = ""
        history = []
        gemini_messages = []

        for msg in messages:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "system":
                system_content = content
            elif role == "user":
                gemini_messages.append({"role": "user", "parts": [content]})
            elif role == "assistant":
                gemini_messages.append({"role": "model", "parts": [content]})

        # Prepend system content to first user message if present
        if system_content and gemini_messages and gemini_messages[0]["role"] == "user":
            gemini_messages[0]["parts"][0] = (
                f"[System Instructions]\n{system_content}\n\n"
                f"[User Message]\n{gemini_messages[0]['parts'][0]}"
            )

        client = genai.GenerativeModel(model_name)
        
        # Use last message as prompt, rest as history
        if len(gemini_messages) > 1:
            chat = client.start_chat(history=gemini_messages[:-1])
            last_msg = gemini_messages[-1]["parts"][0]
            response = chat.send_message(last_msg, stream=True)
        else:
            prompt = gemini_messages[0]["parts"][0] if gemini_messages else ""
            response = client.generate_content(prompt, stream=True)

        for chunk in response:
            text = getattr(chunk, "text", None)
            if text:
                yield text

    def test_connection(self) -> tuple[bool, str]:
        try:
            import google.generativeai as genai  # type: ignore
            if not self._api_key:
                return False, "✗ Gemini API key not set"
            genai.configure(api_key=self._api_key)
            models = list(genai.list_models())
            if models:
                return True, "✓ Gemini key valid"
            return False, "✗ No models available"
        except Exception as exc:
            return False, f"✗ {exc}"
