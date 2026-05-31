"""HTTP client for the Codeforces public API."""

from __future__ import annotations

import requests

BASE_URL = "https://codeforces.com/api"


class CodeforcesClientError(Exception):
    """Raised when a Codeforces API request fails at the HTTP or transport layer."""


class CodeforcesAPIError(Exception):
    """Raised when the Codeforces API responds with a non-OK status field."""


class CodeforcesClient:
    def __init__(
        self,
        *,
        base_url: str = BASE_URL,
        session: requests.Session | None = None,
        timeout: float = 30.0,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._session = session or requests.Session()
        self._timeout = timeout

    def get_user_info(self, handle: str) -> dict:
        return self._request("user.info", {"handles": handle})

    def get_user_rating_history(self, handle: str) -> dict:
        return self._request("user.rating", {"handle": handle})

    def get_user_submissions(self, handle: str) -> dict:
        return self._request("user.status", {"handle": handle})

    def _request(self, method: str, params: dict[str, str]) -> dict:
        url = f"{self._base_url}/{method}"
        try:
            response = self._session.get(url, params=params, timeout=self._timeout)
        except requests.exceptions.RequestException as exc:
            raise CodeforcesClientError(
                f"Failed to reach Codeforces API at {url}: {exc}"
            ) from exc

        if response.status_code != 200:
            raise CodeforcesClientError(
                f"Codeforces API returned HTTP {response.status_code} for {url}"
            )

        try:
            payload = response.json()
        except ValueError as exc:
            raise CodeforcesClientError(
                f"Invalid JSON response from Codeforces API at {url}"
            ) from exc

        if payload.get("status") != "OK":
            comment = payload.get("comment", "no comment provided")
            raise CodeforcesAPIError(
                f"Codeforces API call {method} failed: {comment}"
            )

        return payload
