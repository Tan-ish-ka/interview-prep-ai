"""Query parameter validation for report endpoints."""

from __future__ import annotations

from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ReportQueryParams(BaseModel):
    """Validated query string for GET /report."""

    model_config = ConfigDict(str_strip_whitespace=True)

    url: str = Field(
        ...,
        min_length=8,
        description="Competitive programming profile URL",
        examples=["https://codeforces.com/profile/tourist"],
    )

    @field_validator("url")
    @classmethod
    def validate_profile_url(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme not in ("http", "https"):
            raise ValueError("URL must use http or https scheme")
        if not parsed.netloc:
            raise ValueError("URL must include a host")
        return value
