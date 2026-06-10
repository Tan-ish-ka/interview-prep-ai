#!/usr/bin/env python3
"""Test the /report API endpoint directly."""

from fastapi.testclient import TestClient
from interview_prep_ai.app.main import app

def main():
    client = TestClient(app)
    print("Sending request to /report...")
    response = client.get("/report", params={"url": "https://codeforces.com/profile/tourist"})
    print(f"Response status code: {response.status_code}")
    if response.status_code == 200:
        print("Success!")
        print("First 100 chars of JSON:", str(response.json())[:100])
    else:
        print("Error!")
        print("Response JSON:", response.json())

if __name__ == "__main__":
    main()
