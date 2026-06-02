# Interview Prep AI

A Python service that turns competitive programming profiles into structured interview-prep reports. It loads a profile from supported platforms, computes analytics and insights, and returns personalized study recommendations through a FastAPI HTTP API and a CLI.

## Features

- **Profile ingestion** — Fetch and normalize Codeforces profiles (LeetCode and CodeChef URLs are detected; Codeforces is fully supported via the public API).
- **Local caching** — Store profiles as JSON under `data/profiles/` to avoid repeated API calls.
- **Rating analytics** — Current/max rating, lifetime rating change, recent contest delta, and trend (`improving` / `declining` / `stable`).
- **Contest analytics** — Total contests, contests in the last 30 days, and average per-contest rating change.
- **Activity analytics** — Problems solved in the last 30/90 days and average problems per week.
- **Topic insights** — Top tags from solved problems, plus weak and strong topics from tag statistics.
- **Smart recommendations** — Rule-based advice from activity, contests, rating trend, topics, and practice patterns.
- **REST API** — `GET /report?url=<profile-url>` with Pydantic-validated request/response schemas.
- **CLI** — Load a profile URL and print a summary from the terminal.

## Architecture

The project uses a layered, analyzer-based design. Each concern is a small, injectable component; orchestration stays in services.

```
GET /report?url=...
        │
        ▼
┌───────────────────┐
│   FastAPI (app)   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ InterviewPrep     │
│ Service           │
└─────────┬─────────┘
          │
    ┌─────┴─────┬─────────────────┐
    ▼           ▼                 ▼
ProfileManager  InsightGenerator  RecommendationService
    │               │
    │         ┌─────┴──────────────────────────────────┐
    │         │ RatingAnalyzer, RatingTrendAnalyzer,   │
    │         │ ContestAnalyzer, ActivityAnalyzer,     │
    │         │ TagAnalyzer, ProblemAnalyzer,          │
    │         │ WeakTopicAnalyzer, StrongTopicAnalyzer   │
    │         └────────────────────────────────────────┘
    ▼
ProfileService ──► CodeforcesClient
    │
    ▼
JsonProfileRepository (data/profiles/)
```

| Layer | Responsibility |
|-------|----------------|
| `app/` | HTTP routes, Pydantic schemas, dependency wiring |
| `services/` | `ProfileService`, `ProfileManager`, `InterviewPrepService` |
| `analytics/` | Pure analyzers that produce insight fields |
| `recommendations/` | Rule engine over generated insights |
| `repositories/` | Profile persistence (`ProfileRepository` / JSON) |
| `api/` | External HTTP clients (Codeforces) |
| `core/` | Models, enums, platform detection |
| `platforms/` | Platform-specific analyzer stubs |
| `cli/` | Command-line entry point |

## Example API response

**Request**

```http
GET /report?url=https://codeforces.com/profile/tourist
```

**Response** (truncated for readability)

```json
{
  "profile": {
    "username": "tourist",
    "platform": "codeforces",
    "current_rating": 3858,
    "max_rating": 3919,
    "solved_problems": [],
    "tag_stats": [
      { "tag": "dp", "solved_count": 120, "attempt_count": 0 }
    ],
    "rating_history": { "status": "OK", "result": [] }
  },
  "insights": {
    "current_rating": 3858,
    "max_rating": 3919,
    "rating_delta": 58,
    "recent_rating_delta": 61,
    "rating_trend": "improving",
    "contest_stats": {
      "total_contests": 120,
      "contests_last_30_days": 3,
      "average_rating_change": 12.5
    },
    "activity_stats": {
      "problems_last_30_days": 8,
      "problems_last_90_days": 20,
      "average_problems_per_week": 1.56
    },
    "total_solved": 42,
    "recent_activity": 5,
    "top_tags": { "dp": 10, "graphs": 8 },
    "weak_topics": ["greedy"],
    "strong_topics": ["dp", "graphs", "math"]
  },
  "recommendations": [
    "Increase your practice consistency — aim for more regular solving sessions.",
    "Practice more greedy problems.",
    "Leverage your strength in dp."
  ]
}
```

Interactive docs: `http://127.0.0.1:8000/docs` after starting the server.

## Installation

**Requirements:** Python 3.11+

Clone the repository and install in editable mode with dev dependencies:

```bash
git clone https://github.com/Tan-ish-ka/interview-prep-ai.git
cd interview-prep-ai
pip install -e ".[dev]"
```

## Running FastAPI locally

From the project root (where `pyproject.toml` lives):

```bash
uvicorn interview_prep_ai.app.main:app --reload
```

Then open:

- API: `http://127.0.0.1:8000/report?url=https://codeforces.com/profile/<handle>`
- Swagger UI: `http://127.0.0.1:8000/docs`

Profiles are cached under `data/profiles/<platform>/<username>.json`. Delete a cache file to force a fresh fetch from Codeforces.

## Docker

**Requirements:** Docker and Docker Compose

Build and start the API on port **8000**:

```bash
docker compose up --build
```

Run in the background:

```bash
docker compose up --build -d
```

Then open:

- API: `http://127.0.0.1:8000/report?url=https://codeforces.com/profile/<handle>`
- Swagger UI: `http://127.0.0.1:8000/docs`

Profile cache is persisted via a volume mount (`./data/profiles` on the host → `/app/data/profiles` in the container).

Stop the stack:

```bash
docker compose down
```

Build the image without Compose:

```bash
docker build -t interview-prep-ai .
docker run --rm -p 8000:8000 -v "%cd%/data/profiles:/app/data/profiles" interview-prep-ai
```

On Linux or macOS, replace `%cd%` with `$(pwd)`.

## Running tests

```bash
python -m pytest
```

Verbose run:

```bash
python -m pytest -v
```

## Technologies used

| Technology | Purpose |
|------------|---------|
| **Python 3.11+** | Language runtime |
| **FastAPI** | HTTP API and OpenAPI docs |
| **Pydantic v2** | Request/response validation |
| **requests** | Codeforces API client |
| **pytest** | Unit and integration tests |
| **httpx** | Test client for API tests (dev dependency) |
| **setuptools** | Packaging (`src/` layout) |
| **Docker** | Containerized API deployment |
| **uvicorn** | ASGI server for FastAPI (Docker / local run) |

## Future improvements

- Full LeetCode and CodeChef profile builders (analyzers are stubbed today).
- Cache invalidation or TTL instead of manual cache deletion.
- Populate `attempt_count` in tag statistics from submission history.
- Additional platforms and unified tag normalization across sites.
- Authentication and rate limiting for the public API.
- Frontend dashboard for visualizing reports and trends.

## License

See repository license file if present; otherwise treat as project source for educational use.
