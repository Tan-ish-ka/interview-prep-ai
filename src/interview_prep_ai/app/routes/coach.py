"""Interview Coach chat route — streams GPT responses using the OpenAI Responses API."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from interview_prep_ai.ai_providers.factory import ProviderFactory
from interview_prep_ai.app.schemas.coach import CoachChatRequest

router = APIRouter(prefix="/coach", tags=["coach"])


# ---------------------------------------------------------------------------
# Company knowledge base
# ---------------------------------------------------------------------------

_COMPANIES_PATH = Path(__file__).resolve().parents[5] / "data" / "companies.json"

def _load_companies() -> dict:
    if _COMPANIES_PATH.exists():
        try:
            return json.loads(_COMPANIES_PATH.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


# ---------------------------------------------------------------------------
# System prompt builder
# ---------------------------------------------------------------------------

def _build_system_prompt(req: CoachChatRequest) -> str:
    p = req.profile
    ins = req.insights
    prep = req.interview_preparation
    companies = _load_companies()

    # --- profile block ---
    profile_block = f"""## User Profile
- **Handle**: @{p.username} on {p.platform}
- **Current Rating**: {ins.current_rating if ins.current_rating is not None else 'unrated'}
- **Peak Rating**: {ins.max_rating if ins.max_rating is not None else 'unrated'}
- **Rating Trend**: {ins.rating_trend}
- **Recent Rating Δ**: {f'+{ins.recent_rating_delta}' if ins.recent_rating_delta and ins.recent_rating_delta > 0 else ins.recent_rating_delta}
- **Total Problems Solved**: {ins.total_solved}
- **Skill Score**: {ins.skill_score}/100
- **Momentum Score**: {ins.momentum_score}/100
- **Interview Readiness**: {prep.interview_readiness_level or 'Not computed'}"""

    # --- activity block ---
    cs = ins.contest_stats
    act = ins.activity_stats
    activity_block = f"""## Activity
- **Problems (last 30 days)**: {act.get('problems_last_30_days', 0)}
- **Problems (last 90 days)**: {act.get('problems_last_90_days', 0)}
- **Avg problems/week (90d)**: {act.get('average_problems_per_week', 0):.1f}
- **Recent activity (solved count)**: {ins.recent_activity}
- **Total contests**: {cs.get('total_contests', 0)}
- **Contests (last 30 days)**: {cs.get('contests_last_30_days', 0)}
- **Avg rating change/contest**: {cs.get('average_rating_change', 'N/A')}"""

    # --- topics block ---
    strong = ", ".join(ins.strong_topics) if ins.strong_topics else "None identified yet"
    weak = ", ".join(ins.weak_topics) if ins.weak_topics else "None identified"
    top_tags_str = (
        ", ".join(f"{k} ({v})" for k, v in list(ins.top_tags.items())[:8])
        if ins.top_tags else "No data"
    )
    topics_block = f"""## Topics
- **Strong Topics**: {strong}
- **Weak Topics**: {weak}
- **Top solved tags**: {top_tags_str}"""

    # --- potential / AI insight block ---
    pe = ins.potential_efficiency or {}
    ai_ins = ins.ai_insight or {}
    insight_block = f"""## AI Insight (pre-computed)
- **Growth Potential**: {pe.get('growth_potential', 'N/A')}
- **Efficiency Score**: {pe.get('efficiency_score', 'N/A')}/100
- **AI Summary**: {ai_ins.get('summary', 'N/A')}
- **Strengths**: {ai_ins.get('strengths', 'N/A')}
- **Growth Opportunity**: {ai_ins.get('growth_opportunity', 'N/A')}"""

    # --- roadmap block ---
    roadmap_lines = [
        f"  {i+1}. [{item.get('category','')}] {item.get('title','')}: {item.get('description','')}"
        for i, item in enumerate(prep.roadmap[:8])
    ]
    roadmap_block = "## Interview Roadmap\n" + (
        "\n".join(roadmap_lines) if roadmap_lines else "  Not generated yet"
    )

    # --- company readiness block ---
    cr_lines = [
        f"  - {item.get('company','')}: {item.get('level','')} (score {item.get('score','')})"
        for item in prep.company_readiness[:8]
    ]
    company_ready_block = "## Company Readiness\n" + (
        "\n".join(cr_lines) if cr_lines else "  Not computed"
    )

    # --- focus areas block ---
    focus_lines = [
        f"  - {fa.get('area','')}: {fa.get('status','')} ({fa.get('solved_count',0)} solved)"
        for fa in prep.interview_focus_areas[:10]
    ]
    focus_block = "## Interview Focus Areas\n" + (
        "\n".join(focus_lines) if focus_lines else "  Not computed"
    )

    # --- recommendations block ---
    rec_lines = [f"  {i+1}. {r}" for i, r in enumerate(req.recommendations[:10])]
    rec_block = "## Current Recommendations\n" + (
        "\n".join(rec_lines) if rec_lines else "  None"
    )

    # --- comparison block ---
    cmp_block = ""
    if req.comparison:
        cmp = req.comparison
        h2h = cmp.get("head_to_head", {})
        profile_b = cmp.get("profile_b", {})
        cmp_block = f"""## Comparison Data
- **Compared with**: @{profile_b.get('username', 'unknown')}
- **Skill Winner**: {h2h.get('skill', 'N/A')}
- **Consistency Winner**: {h2h.get('consistency', 'N/A')}
- **Activity Winner**: {h2h.get('activity', 'N/A')}
- **Summary**: {h2h.get('summary', 'N/A')}"""

    # --- companies knowledge ---
    companies_block = ""
    if companies:
        lines = []
        for name, data in list(companies.items())[:6]:
            topics = ", ".join(data.get("important_topics", [])[:5])
            diff = data.get("difficulty", "")
            lines.append(f"  - **{name}**: {diff} — Key topics: {topics}")
        companies_block = "## Company Knowledge Base\n" + "\n".join(lines)

    # --- assemble ---
    sections = [
        profile_block, activity_block, topics_block, insight_block,
        roadmap_block, company_ready_block, focus_block, rec_block,
    ]
    if cmp_block:
        sections.append(cmp_block)
    if companies_block:
        sections.append(companies_block)

    analytics_context = "\n\n".join(sections)

    return f"""You are **Interview Prep AI** — an expert Software Engineering Interview Coach.

You have full access to this user's analytics, generated live from their actual competitive programming profile. Use this data to give specific, personalized advice.

**CRITICAL RULES:**
- When answering questions about interview preparation, company preparation, or study plans, NEVER answer generically. Always tailor your advice specifically to the user's live analytics, solved topics, weak topics, rating, momentum, interview readiness, recommendations, and company knowledge.
- If any of this information is unavailable, missing, or shows "N/A" (such as a missing LeetCode handle, lack of solved problems in key areas, or no target companies selected), you MUST explicitly state what additional data or profile handles would improve the accuracy and quality of your recommendations.
- Never fabricate or estimate any number (rating, solved count, score). Only use numbers from the analytics below.
- Always ground your advice in the user's actual stats.
- Use markdown formatting: headers, bullet lists, code blocks, bold, tables.
- Be concise but thorough. Structure your response clearly.
- When suggesting problems, name the topic and difficulty level.
- For roadmaps, use numbered lists with timeframes.

---

# Live Analytics Context

{analytics_context}

---

You are ready to answer questions about competitive programming, DSA, interview preparation, system design, career planning, company readiness, study roadmaps, and anything related to software engineering interviews. Personalize every response using the analytics above."""


# ---------------------------------------------------------------------------
# Streaming generator
# ---------------------------------------------------------------------------

from interview_prep_ai.ai_providers.manager import AIService
from interview_prep_ai.app.auth_deps import get_current_user
from interview_prep_ai.core.models.user import User
from interview_prep_ai.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

async def _stream_coach_response(req: CoachChatRequest, user: User, db: AsyncSession) -> AsyncGenerator[str, None]:
    """Yields SSE-formatted text chunks via the selected AI provider."""
    system_prompt = _build_system_prompt(req)

    messages: list[dict] = []
    for turn in req.conversation[-20:]:
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": req.message})

    async def track_usage(provider_name: str):
        user.ai_requests += 1
        db.add(user)
        await db.commit()

    ai_service = AIService()
    
    try:
        async for chunk in ai_service.stream_deterministic(
            task_type="interview_coach",
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


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

@router.post("/chat")
async def coach_chat(
    req: CoachChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> StreamingResponse:
    """Stream an AI coach response informed by the user's full analytics context."""
    return StreamingResponse(
        _stream_coach_response(req, current_user, db),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
