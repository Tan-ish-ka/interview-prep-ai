"""Factory that creates the correct AIProvider from a provider name + optional API key.

Usage:
    provider = ProviderFactory.create("openai", api_key="sk-...")
    async for chunk in provider.stream_chat(messages):
        ...
"""

from __future__ import annotations

from interview_prep_ai.ai_providers import AIProvider
from interview_prep_ai.ai_providers.openai_provider import OpenAIProvider
from interview_prep_ai.ai_providers.gemini_provider import GeminiProvider
from interview_prep_ai.ai_providers.anthropic_provider import AnthropicProvider
from interview_prep_ai.ai_providers.groq_provider import GroqProvider
from interview_prep_ai.ai_providers.openrouter_provider import OpenRouterProvider

_REGISTRY: dict[str, type[AIProvider]] = {
    "openai": OpenAIProvider,
    "gemini": GeminiProvider,
    "anthropic": AnthropicProvider,
    "groq": GroqProvider,
    "openrouter": OpenRouterProvider,
}


class ProviderFactory:
    @staticmethod
    def create(provider: str, api_key: str | None = None) -> AIProvider:
        """Instantiate the appropriate AIProvider.
        
        Args:
            provider: One of 'openai', 'gemini', 'anthropic', 'groq', 'openrouter'.
                      Defaults to 'openai' if unrecognised.
            api_key: User-supplied API key. If None, falls back to env vars.
        
        Returns:
            An initialised AIProvider instance.
        """
        provider_lower = (provider or "openai").lower().strip()
        cls = _REGISTRY.get(provider_lower, OpenAIProvider)
        return cls(api_key=api_key or None)

    @staticmethod
    def available_providers() -> list[str]:
        return list(_REGISTRY.keys())
