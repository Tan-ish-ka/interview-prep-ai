"""AI Solution Intelligence Engine route — streams GPT-4o code analysis via SSE."""

from __future__ import annotations

import json
import os
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from interview_prep_ai.ai_providers.factory import ProviderFactory
from interview_prep_ai.app.schemas.solution import SolutionAnalyzeRequest

router = APIRouter(prefix="/solution", tags=["solution"])


def _build_solution_prompt(req: SolutionAnalyzeRequest) -> str:
    """Build a rich, personalized system prompt for solution analysis."""

    # Language display names
    lang_map = {"cpp": "C++", "java": "Java", "python": "Python", "javascript": "JavaScript", "other": "Unknown"}
    lang = lang_map.get(req.language, req.language)

    # Problem context block
    problem_block = ""
    if req.problem_id or req.problem_title:
        problem_block = f"\n**Problem**: {req.problem_title or 'Unknown'} (ID: {req.problem_id or 'N/A'})"
    if req.problem_tags:
        problem_block += f"\n**Problem Tags/Topics**: {', '.join(req.problem_tags)}"
    if req.verdict:
        verdict_display = {
            "OK": "✅ Accepted",
            "WRONG_ANSWER": "❌ Wrong Answer",
            "TIME_LIMIT_EXCEEDED": "⏰ Time Limit Exceeded",
            "RUNTIME_ERROR": "💥 Runtime Error",
            "COMPILATION_ERROR": "🔧 Compilation Error",
            "MEMORY_LIMIT_EXCEEDED": "🧠 Memory Limit Exceeded",
        }.get(req.verdict, req.verdict)
        problem_block += f"\n**Verdict**: {verdict_display}"

    # User profile personalization block
    profile_block = ""
    if req.username:
        profile_block = f"\n\n## User Profile Context (for personalization)\n- **Handle**: @{req.username}"
        if req.strong_topics:
            profile_block += f"\n- **Strong Topics**: {', '.join(req.strong_topics[:8])}"
        if req.weak_topics:
            profile_block += f"\n- **Weak Topics**: {', '.join(req.weak_topics[:8])}"
        if req.learning_dna_traits:
            profile_block += f"\n- **Learning DNA**: {', '.join(req.learning_dna_traits)}"
        if req.root_cause_summary:
            profile_block += f"\n- **Known Failure Patterns**: {req.root_cause_summary}"
        if req.target_companies:
            profile_block += f"\n- **Target Companies**: {', '.join(req.target_companies)}"

    return f"""You are **Interview Prep AI — Solution Intelligence Engine**, a world-class coding mentor and senior software engineer with deep expertise in competitive programming, DSA, and technical interviews.

You will analyze the provided code submission and generate a **comprehensive, structured, personalized AI code review** suitable for interview preparation.

## Submission Details
**Language**: {lang}{problem_block}{profile_block}

---

## Your Analysis Must Cover All 10 Sections Below

Format your response in clean Markdown with clear section headers. Be specific, technical, and deeply educational. Never be vague.

---

### 🧠 1. Algorithm Detection
Identify the **exact algorithm(s)** used in this code. Be precise:
- Primary algorithm (e.g., BFS, DP with Memoization, Greedy, Two Pointer, etc.)
- Secondary techniques used (e.g., hashing, binary search as sub-routine)
- Is this the **optimal approach** for the problem given the tags/verdict?

### ⏱️ 2. Complexity Analysis
Provide:
- **Time Complexity** (with justification per loop/recursion level)
- **Space Complexity** (including implicit stack space for recursion)
- If TLE: What complexity is needed? What complexity does this code achieve?

### 🐛 3. Root Cause Analysis
{f"The verdict was **{req.verdict}** — analyze specifically WHY this verdict occurred:" if req.verdict else "Predict potential failure modes:"}
- List ALL possible root causes with confidence scores (0–100%)
- For each cause: explain the exact mechanism, which line(s) of code cause it, and how to fix it
- Distinguish between: **certain cause** vs **likely cause** vs **possible cause**

### 🔍 4. Bug & Edge Case Detection
Scan the code for:
- Off-by-one errors
- Integer overflow (especially in C++ with `int` vs `long long`)
- Unhandled edge cases (empty input, single element, negative numbers, duplicates, large values)
- Null/uninitialized variable usage
- Incorrect loop bounds
- Missing base cases in recursion

### 💡 5. Better Solution Recommendation
If the approach is suboptimal:
- State the **detected approach** and why it is suboptimal
- State the **recommended approach** with reasoning
- Show the **complexity improvement** (e.g., O(2^N) → O(N²))
- Provide a **conceptual sketch** of the optimal solution (pseudocode or key insight)

### 🏗️ 6. Code Quality & Interview Readiness
Review like a senior engineer in a Google/Meta interview:
- Variable naming (clear vs cryptic)
- Readability and structure
- Use of helper functions
- Comments (present/missing/misleading)
- Code style (consistent indentation, bracket usage)
- Would this pass a Google code review? Rate: Poor / Needs Work / Good / Excellent
- **Interview Score**: X/10 (with specific reasons)

### 📚 7. Personalized Topic Recommendations
Based on the mistakes detected AND the user's profile context:
- List 3–5 specific topics to study (not generic, tied to actual bugs found)
- For each topic: explain WHY it's needed based on evidence from THIS code
- Recommend specific problem types to practice

### 🏢 8. Company Mapping
Map this problem's algorithmic pattern to target companies:
- Which FAANG/top companies frequently ask this pattern?
- What is the expected solution quality at each company?
- If the user has target companies in their profile, specifically address readiness for those

### 🚨 9. Learning Gap Detection
Based on the mistakes and approach:
- What **core concept** does this code reveal the user may be missing?
- Infer the conceptual gap (e.g., "Uses recursion but doesn't optimize with memoization → likely hasn't internalized DP state transitions")
- Confidence: X%
- Recommended learning path to close this gap

### ✅ 10. Explainability Summary
Provide a final summary table:
| Aspect | Finding | Confidence | Evidence |
|--------|---------|------------|----------|
| Algorithm | ... | ...% | line X |
| Root Cause | ... | ...% | ... |
| Biggest Bug | ... | ...% | ... |
| Interview Readiness | .../10 | — | ... |

End with a 2-3 sentence **personalized coaching message** directly addressing the user by name (if provided) referencing their known patterns.

---

Now analyze the following {lang} code:"""


from interview_prep_ai.ai_providers.manager import AIService
from interview_prep_ai.app.auth_deps import get_current_user
from interview_prep_ai.core.models.user import User
from interview_prep_ai.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

async def _stream_solution_analysis(req: SolutionAnalyzeRequest, user: User, db: AsyncSession) -> AsyncGenerator[str, None]:
    """Yields SSE-formatted chunks for solution analysis via the selected provider."""
    system_prompt = _build_solution_prompt(req)

    lang_fence = {"cpp": "cpp", "java": "java", "python": "python", "javascript": "javascript"}.get(req.language, "")
    code_block = f"```{lang_fence}\n{req.code}\n```"

    messages: list[dict] = [
        {"role": "user", "content": code_block},
    ]
    
    async def track_usage(provider_name: str):
        user.ai_requests += 1
        db.add(user)
        await db.commit()

    ai_service = AIService()

    try:
        async for chunk in ai_service.stream_deterministic(
            task_type="code_review",
            messages=messages,
            system_content=system_prompt,
            track_usage_callback=track_usage
        ):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as exc:
        error_str = str(exc)
        yield f"data: {json.dumps({'error': error_str})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/analyze")
async def analyze_solution(
    req: SolutionAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> StreamingResponse:
    """Stream a full AI analysis of a submitted code solution."""
    return StreamingResponse(
        _stream_solution_analysis(req, current_user, db),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
