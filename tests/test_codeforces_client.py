from unittest.mock import MagicMock, patch

import pytest
import requests

from interview_prep_ai.api.codeforces_client import (
    BASE_URL,
    CodeforcesAPIError,
    CodeforcesClient,
    CodeforcesClientError,
)


@pytest.fixture
def client() -> CodeforcesClient:
    return CodeforcesClient()


def _mock_response(
    *,
    status_code: int = 200,
    json_data: dict | None = None,
    text: str = "",
) -> MagicMock:
    response = MagicMock()
    response.status_code = status_code
    response.text = text
    if json_data is None:
        response.json.side_effect = ValueError("no json")
    else:
        response.json.return_value = json_data
    return response


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_get_user_info_success(mock_get: MagicMock, client: CodeforcesClient) -> None:
    payload = {"status": "OK", "result": [{"handle": "tourist"}]}
    mock_get.return_value = _mock_response(json_data=payload)

    result = client.get_user_info("tourist")

    assert result == payload
    mock_get.assert_called_once_with(
        f"{BASE_URL}/user.info",
        params={"handles": "tourist"},
        timeout=30.0,
    )


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_get_user_rating_history_success(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    payload = {"status": "OK", "result": [{"contestId": 1}]}
    mock_get.return_value = _mock_response(json_data=payload)

    result = client.get_user_rating_history("tourist")

    assert result == payload
    mock_get.assert_called_once_with(
        f"{BASE_URL}/user.rating",
        params={"handle": "tourist"},
        timeout=30.0,
    )


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_get_user_submissions_success(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    payload = {"status": "OK", "result": [{"id": 1}]}
    mock_get.return_value = _mock_response(json_data=payload)

    result = client.get_user_submissions("tourist")

    assert result == payload
    mock_get.assert_called_once_with(
        f"{BASE_URL}/user.status",
        params={"handle": "tourist", "from": "1", "count": "10000"},
        timeout=30.0,
    )


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_get_user_submissions_paginates(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    first_page = {"status": "OK", "result": [{"id": i} for i in range(3)]}
    second_page = {"status": "OK", "result": [{"id": 99}]}
    mock_get.side_effect = [
        _mock_response(json_data=first_page),
        _mock_response(json_data=second_page),
    ]

    result = client.get_user_submissions("tourist", page_size=3)

    assert result["result"] == first_page["result"] + second_page["result"]
    assert mock_get.call_count == 2


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_request_exception_raises_client_error(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    mock_get.side_effect = requests.exceptions.ConnectionError("offline")

    with pytest.raises(CodeforcesClientError, match="Failed to reach Codeforces API"):
        client.get_user_info("tourist")


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_non_200_raises_client_error(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    mock_get.return_value = _mock_response(status_code=503, text="unavailable")

    with pytest.raises(CodeforcesClientError, match="HTTP 503"):
        client.get_user_info("tourist")


@patch("interview_prep_ai.api.codeforces_client.requests.Session.get")
def test_api_status_not_ok_raises_api_error(
    mock_get: MagicMock, client: CodeforcesClient
) -> None:
    mock_get.return_value = _mock_response(
        json_data={"status": "FAILED", "comment": "handles: User with handle tourist not found"}
    )

    with pytest.raises(CodeforcesAPIError, match="User with handle tourist not found"):
        client.get_user_info("tourist")
