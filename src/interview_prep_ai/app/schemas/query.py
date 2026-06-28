"""Query parameter validation for report endpoints."""

from __future__ import annotations

from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ReportQueryParams(BaseModel):
    """Validated query string for GET /report."""

    model_config = ConfigDict(str_strip_whitespace=True)

    url: str | None = Field(
        None,
        description="Competitive programming profile URL (legacy single URL)",
        examples=["https://codeforces.com/profile/tourist"],
    )
    urls: str | None = Field(
        None,
        description="Comma-separated list of competitive programming profile URLs",
        examples=["https://codeforces.com/profile/tourist,https://leetcode.com/u/neal_wu"],
    )

    @field_validator("url")
    @classmethod
    def validate_profile_url(cls, value: str | None) -> str | None:
        if not value: return value
        parsed = urlparse(value)
        if parsed.scheme not in ("http", "https"):
            raise ValueError("URL must use http or https scheme")
        if not parsed.netloc:
            raise ValueError("URL must include a host")
        return value
        
    @field_validator("urls")
    @classmethod
    def validate_profile_urls(cls, value: str | None) -> str | None:
        if not value: return value
        for u in value.split(","):
            parsed = urlparse(u.strip())
            if parsed.scheme not in ("http", "https"):
                raise ValueError(f"URL {u} must use http or https scheme")
            if not parsed.netloc:
                raise ValueError(f"URL {u} must include a host")
        return value
