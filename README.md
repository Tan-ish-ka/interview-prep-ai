<div align="center">
  <img src="https://via.placeholder.com/150?text=Logo" alt="Interview Prep AI Logo" width="150" height="150" />
  
  <h1>Interview Prep AI</h1>
  
  <p><b>AI-powered interview preparation platform that transforms competitive programming profiles into personalized analytics, company readiness insights, and GenAI-powered interview coaching.</b></p>

  <p>
    <a href="https://github.com/yourusername/interview-prep-ai/stargazers"><img src="https://img.shields.io/github/stars/yourusername/interview-prep-ai?style=for-the-badge" alt="GitHub Stars" /></a>
    <a href="https://github.com/yourusername/interview-prep-ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
    <img src="https://img.shields.io/badge/Python-3.11-3776AB.svg?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/PostgreSQL-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  </p>
</div>

---

## 📖 Overview

**Problem:** Competitive programming platforms generate massive amounts of data (submissions, rating deltas, topics) but fail to translate that data into actionable insights for corporate hiring bars (FAANG, tier-2, startups).
**Solution:** Interview Prep AI bridges the gap between competitive programming and real-world software engineering interviews. 
**Key Idea:** It aggregates raw CP data across platforms, runs deterministic heuristic analytics to find weaknesses, and passes the distilled context to Large Language Models (LLMs) to generate personalized study plans and mock interviews.
**Who is this for?** Competitive programmers, CS students, and SWE candidates looking to optimize their interview preparation using their existing coding history.

---

## ✨ Features

### 📊 Analytics
- **Skill Assessment:** Normalized scoring across platforms (e.g., Codeforces vs LeetCode).
- **Interview Readiness:** Rule-based mapping of CP stats to corporate hiring bars.
- **Topic Intelligence:** Identifies knowledge gaps (Weak Topics) and proficiencies (Strong Topics).
- **Growth Trends:** Momentum scoring based on moving averages of recent contests.
- **Contest Replay:** *(In Progress)* Simulate past contests to analyze decision-making speed.
- **Company Readiness:** Deterministic intelligence engine evaluating readiness for specific companies.
- **Compare Dashboard:** Side-by-side benchmarking of profiles using Recharts radar and bar graphs.
- **Recommendation Engine:** Rule-based actionable advice based on activity and trends.

### 🤖 AI Features
- **AI Interview Coach:** Real-time interactive coach for algorithm deep-dives.
- **GenAI Study Plans:** 4-week tailored learning paths.
- **Skill Gap Analysis:** LLM reasoning applied to identified weak topics.
- **Company-specific Recommendations:** Targeted advice for FAANG and specific tech stacks.
- **AI Code Review:** *(In Progress)* 
- **Multi-provider LLM Support:** Seamlessly routes between OpenAI, Anthropic, Gemini, Groq, and OpenRouter.
- **Streaming AI Responses:** Low-latency chunked responses via Server-Sent Events (SSE).

### 🔐 Authentication
- **JWT Login:** Secure JSON Web Tokens stored and managed by the client.
- **User Profiles:** Track generated reports and AI usage quotas.
- **Protected APIs:** FastAPI route protection via dependency injection.
- **Session Management:** Refresh token lifecycle handling.

### 🌐 Multi-Platform Support
- **Codeforces:** Full API integration for user info, status, and rating.
- **LeetCode:** Seamless tag and platform normalization.
- **CodeChef:** Seamless tag and platform normalization.

---

## 📸 Screenshots

| Dashboard | Analytics |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Dashboard+Screenshot" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250?text=Analytics+Screenshot" alt="Analytics" /> |

| Compare | Companies |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=Compare+Screenshot" alt="Compare" /> | <img src="https://via.placeholder.com/400x250?text=Companies+Screenshot" alt="Companies" /> |

| AI Coach | Platforms |
| :---: | :---: |
| <img src="https://via.placeholder.com/400x250?text=AI+Coach+Screenshot" alt="AI Coach" /> | <img src="https://via.placeholder.com/400x250?text=Platforms+Screenshot" alt="Platforms" /> |

*(Note: Add actual screenshots to the repository and update the paths above.)*

---

## 🏗 Architecture

The platform uses a layered, decoupled architecture ensuring the UI, business logic, and database remain strictly independent.

### Component Flow

```mermaid
graph TD
    A[React/Vite Frontend] <-->|REST API + JWT| B(FastAPI Backend)
    B <-->|PostgreSQL/SQLAlchemy| C[(User & Auth Database)]
    B <-->|External HTTP| D[Codeforces/LeetCode/CodeChef APIs]
    B <-->|External HTTP| E[AI Providers: OpenAI, Anthropic, Gemini, Groq]
```

### Request Lifecycle (Generate Report)

```mermaid
sequenceDiagram
    participant Browser
    participant React
    participant FastAPI
    participant ProfileManager
    participant AnalyticsEngine
    participant AIService
    participant Codeforces
    participant OpenAI
    
    Browser->>React: Submit URL
    React->>FastAPI: GET /report?url=...
    FastAPI->>ProfileManager: get_profile()
    ProfileManager->>Codeforces: HTTP GET user.info
    ProfileManager-->>FastAPI: Raw Data
    FastAPI->>AnalyticsEngine: compute_metrics()
    AnalyticsEngine-->>FastAPI: Structured Metrics
    FastAPI->>AIService: generate_insights(Metrics)
    AIService->>OpenAI: POST /chat/completions
    OpenAI-->>FastAPI: JSON
    FastAPI->>React: 200 OK (Validated Pydantic JSON)
    React->>Browser: Render Recharts & Markdown
```

---

## 💻 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Python 3.11, FastAPI, Uvicorn, Pydantic
- **Database:** PostgreSQL (asyncpg), SQLAlchemy ORM, Alembic Migrations
- **Authentication:** JWT, bcrypt
- **AI / LLMs:** OpenAI API, Anthropic, Gemini, Groq
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Visualization:** Recharts

---

## 📂 Folder Structure

```text
interview-prep-ai/
├── frontend/                 # React application
│   ├── src/
│   │   ├── api/              # Axios/Fetch clients
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── pages/            # Top-level route components
│   │   └── utils/            # Helper functions
├── src/interview_prep_ai/    # Backend Python application
│   ├── alembic/              # Database migration scripts
│   ├── api/                  # External HTTP clients (Codeforces)
│   ├── app/                  # FastAPI web layer (routes, schemas, security)
│   ├── core/                 # Enums, Models (User), Business logic interfaces
│   ├── platforms/            # Platform-specific parsers
│   ├── recommendations/      # Rule Engine mapping analytics to advice
│   ├── repositories/         # Database persistence layer
│   └── services/             # Orchestration (InterviewPrepService, AIService)
```

---

## 🚀 Installation & Setup

### 1. Database Setup
Ensure you have PostgreSQL installed and running. Create a database for the project.

### 2. Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/interview-prep-ai.git
cd interview-prep-ai

# Create and activate virtual environment
python3.11 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment Variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials, Secret Key, and API Keys
# Example:
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
# SECRET_KEY=your_secure_random_string
# OPENAI_API_KEY=sk-...

# Run Alembic migrations to create tables
alembic upgrade head

# Start the FastAPI server
uvicorn src.interview_prep_ai.app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register`: Creates a new user. Expects JSON `{email, username, password}`. Returns JWT.
- `POST /auth/login`: Authenticates a user. Expects form data `username`, `password`. Returns JWT.
- `GET /auth/me`: Returns the authenticated user's profile. Requires Bearer Token.

### Reports & Analytics
- `GET /report?url={profile_url}`: Generates a full analytics and AI prep report for a profile. Requires Bearer Token.
  - **Response:** JSON containing `profile`, `insights`, `recommendations`, and `interview_preparation`.
- `GET /platforms/analysis`: Evaluates multiple profiles for the Compare Dashboard.

### AI Coach
- `POST /coach/chat`: Streams an interactive chat session with the AI Coach based on the user's specific metrics.

---

## 🧠 AI Architecture & Flow

Instead of exposing API keys to the frontend, the backend manages all LLM interactions via the `AIService` and `AIProviderManager`.

1. **Prompt Engineering:** The backend translates deterministic analytics (e.g., "Skill Level 85, Weakness: DP") into highly structured system prompts, rather than feeding raw code/submissions to the LLM.
2. **Model Routing:** Heavy analytical tasks are routed to high-tier models (e.g., GPT-4o), while real-time chat interactions utilize fast open-source models (e.g., Llama-3 via Groq).
3. **Fallback:** If a provider (like OpenAI) experiences an outage or rate limit, the `AIProviderManager` automatically catches the exception and routes the prompt to Anthropic or Gemini.
4. **Structured Outputs:** Pydantic is used to enforce strict JSON schemas on the LLM output, preventing hallucinations from breaking the frontend UI.

---

## 📈 Analytics Engine

The core analytics are calculated deterministically in Python:
- **Skill Score:** A weighted, normalized score comparing `current_rating`, `max_rating`, and total problems solved against platform benchmarks.
- **Momentum:** A moving average of recent contest deltas determining if the user is `Improving` or `Declining`.
- **Topic Intelligence:** O(1) hash map frequency counting of all problem tags historically solved to identify strengths and weaknesses.
- **Recommendation Engine:** Strategy pattern rules evaluating activity frequency to provide actionable advice (e.g., "Solve 1 problem a day to rebuild momentum").

---

## 🛤 Future Roadmap

- [ ] Redis Caching implementation for external API rate-limit protection.
- [ ] OAuth Login (Google / GitHub).
- [ ] Docker Compose orchestration for seamless local spin-ups.
- [ ] Background Workers (Celery/RabbitMQ) for asynchronous report generation.
- [ ] Stripe integration for premium SaaS tiers.
- [ ] Resume Analyzer tool.

---

## 👥 Contributors

- **Your Name** - *Full Stack Developer* - [GitHub Profile](https://github.com/yourusername)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
