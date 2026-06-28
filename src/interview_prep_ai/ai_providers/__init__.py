"""Abstract base class for all AI provider implementations."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import AsyncGenerator


class AIProvider(ABC):
    """Every AI provider must implement this interface.
    
    The stream_chat method must yield raw text deltas (not SSE-formatted).
    The caller is responsible for SSE wrapping.
    """

    provider_name: str = "unknown"

    @abstractmethod
    async def stream_chat(
        self,
        messages: list[dict],
        *,
        model: str | None = None,
    ) -> AsyncGenerator[str, None]:
        """Stream chat completion tokens. Yields plain text delta strings."""
        ...

    @abstractmethod
    def test_connection(self) -> tuple[bool, str]:
        """Test if the API key is valid.
        
        Returns:
            (success, message) — e.g. (True, "Connected") or (False, "Invalid key")
        """
        ...
