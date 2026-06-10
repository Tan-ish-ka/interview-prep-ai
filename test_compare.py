#!/usr/bin/env python3
"""Test the /compare API endpoint."""

from fastapi.testclient import TestClient
from interview_prep_ai.app.main import app

def main():
    client = TestClient(app)
    print("Sending request to /compare...")
    response = client.get("/compare", params={"handle_a": "Rehan7", "handle_b": "tourist"})
    print(f"Response status code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
        data = response.json()
        print("Head-to-Head:", data["head_to_head"])
        print("Metric keys:", list(data["metric_comparison"].keys()))
        print("Topic summary keys:", list(data["topic_summary"].keys()))
    else:
        print("Error!")
        print("Response JSON:", response.json())

if __name__ == "__main__":
    main()
