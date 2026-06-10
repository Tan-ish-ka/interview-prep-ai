import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from interview_prep_ai.app.main import create_app
from fastapi.testclient import TestClient

app = create_app()
client = TestClient(app)

print("Testing platforms analysis...")
response = client.get(
    "/platforms/analysis",
    params={
        "codeforces_handle": "tourist",
        "leetcode_handle": "leetcode-user",
        "codechef_handle": "codechef-user"
    }
)
print(f"Response status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print("\nSuccess!")
    print(f"\nUnified Profile:")
    print(f"Username: {data['username']}")
    print(f"Total Solved: {data['total_solved']}")
    print(f"\nPlatforms found: {list(data['platforms'].keys())}")
    for platform, info in data['platforms'].items():
        print(f"\n{platform.upper()}:")
        print(f"  Username: {info['profile']['username']}")
        print(f"  Total Solved: {info['profile']['total_solved']}")
else:
    print(f"Error: {response.text}")
