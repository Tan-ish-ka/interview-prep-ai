"""Persistent JSON cache for AI analysis to reduce token usage and latency."""

import json
import os
from pathlib import Path
from typing import Any

class AICacheRepository:
    """Simple JSON-backed cache for AI-generated reports/analysis."""

    def __init__(self, cache_dir: str = ".interview_prep_data/ai_cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def _get_path(self, cache_key: str) -> Path:
        """Sanitize cache key and return path."""
        safe_key = "".join(c if c.isalnum() else "_" for c in cache_key)
        return self.cache_dir / f"{safe_key}.json"

    def get(self, cache_key: str) -> dict[str, Any] | None:
        """Retrieve item from cache."""
        path = self._get_path(cache_key)
        if not path.exists():
            return None
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return None

    def set(self, cache_key: str, data: dict[str, Any]) -> None:
        """Save item to cache."""
        path = self._get_path(cache_key)
        try:
            path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        except Exception:
            pass
