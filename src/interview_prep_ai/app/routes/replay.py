"""Routes for AI-powered Contest Replay 2.0 features."""

import json
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from interview_prep_ai.app.schemas.replay import (
    AnalyzeContestRequest,
    SimulateContestRequest,
    ReplayChatRequest,
    PersonalityRequest,
)
from interview_prep_ai.ai_providers.factory import ProviderFactory
from interview_prep_ai.repositories.ai_cache_repository import AICacheRepository

router = APIRouter(prefix="/replay", tags=["replay"])
cache = AICacheRepository()

def _build_analyze_prompt(req: AnalyzeContestRequest) -> str:
    timeline_str = "\n".join(
        f"- {ev.time_minutes}m: [{ev.event}] Problem {ev.problem} - {ev.description}"
        for ev in req.contest.timeline
    )
    
    return f"""You are an elite competitive programming coach analyzing a student's contest performance.

Contest Statistics:
- Problems Attempted: {req.contest.problems_attempted}
- Problems Solved: {req.contest.problems_solved}
- Total Penalty: {req.contest.total_penalty_time}m
- Time Wasted (stuck): {req.contest.time_wasted_minutes}m

Chronological Timeline:
{timeline_str}

Please generate a comprehensive, personalized contest report.
Your response MUST STRICTLY follow this Markdown structure:

# Contest Insights Dashboard
- Contest IQ: [Score 0-200]
- Decision Quality: [Score 0-100]
- Time Allocation: [Score 0-100]
- Risk Score: [Score 0-100]
- Debugging Score: [Score 0-100]

# Contest Personality
- Pacing: [Fast Starter | Slow Starter]
- Risk Profile: [Risk Taker | Safe Player]
- Efficiency: [Methodical | Erratic]
- Summary: [1-2 sentences]

# AI Contest Coach
**Biggest Win:** [Your analysis with Evidence, Reasoning, Confidence]
**Biggest Mistake:** [Your analysis with Evidence, Reasoning, Confidence]
**Improvement Plan:** [Actionable recommendation]

# AI Decision Reviews
[For every major event in the timeline (especially TIME_WASTED or WA), provide a review]

### Problem [Problem Letter] at [Time]m
- **Why it mattered:** [Explanation]
- **Evidence:** [Refer to timeline or general competitive programming stats]
- **Confidence:** [Low/Medium/High]
- **Expected Rating Impact:** [e.g., +15 if solved earlier]
"""

async def _stream_analyze(req: AnalyzeContestRequest) -> AsyncGenerator[str, None]:
    cache_key = f"analyze_{req.username}_{req.contest.contest_id}_{req.provider}"
    cached_text = cache.get(cache_key)
    
    if cached_text:
        yield f"data: {json.dumps({'text': cached_text.get('content', '')})}\n\n"
        yield "data: [DONE]\n\n"
        return

    provider = ProviderFactory.create(req.provider, api_key=req.api_key if req.api_key else None)
    prompt = _build_analyze_prompt(req)
    messages = [{"role": "user", "content": prompt}]
    
    full_text = ""
    try:
        async for chunk in provider.stream_chat(messages):
            full_text += chunk
            yield f"data: {json.dumps({'text': chunk})}\n\n"
            
        # Save to cache when done
        if full_text.strip():
            cache.set(cache_key, {"content": full_text})
            
        yield "data: [DONE]\n\n"
    except Exception as exc:
        error_str = str(exc)
        if "quota" in error_str.lower() or "billing" in error_str.lower() or "exceeded" in error_str.lower():
            yield f"data: {json.dumps({'error': 'Quota exceeded. Add credits or switch provider in Settings.'})}\n\n"
        elif "api key" in error_str.lower() or "invalid" in error_str.lower() or "auth" in error_str.lower():
            yield f"data: {json.dumps({'error': 'Invalid API key. Check your key in the Settings tab.'})}\n\n"
        else:
            yield f"data: {json.dumps({'error': error_str})}\n\n"
        yield "data: [DONE]\n\n"


def _build_simulate_prompt(req: SimulateContestRequest) -> str:
    timeline_str = "\n".join(
        f"- {ev.time_minutes}m: [{ev.event}] Problem {ev.problem} - {ev.description}"
        for ev in req.contest.timeline
    )
    return f"""You are an elite competitive programming simulator.
The user wants to run a "What-If" scenario for a past contest.

Original Statistics:
- Solved: {req.contest.problems_solved} / {req.contest.problems_attempted}
- Penalty: {req.contest.total_penalty_time}m
- Wasted: {req.contest.time_wasted_minutes}m

Original Timeline:
{timeline_str}

User's What-If Scenario:
"{req.what_if_scenario}"

Please estimate the impact of this alternative strategy. 
Provide your response strictly in Markdown with these headers:

### Simulation Results
- Estimated Rank Impact: [e.g. +400 places]
- Estimated Rating Impact: [e.g. +41 points]
- Estimated Problems Solved: [e.g. 4]
- Estimated Penalty: [e.g. 120m]

### AI Analysis
- **Why this works (or fails):** [Explanation]
- **Evidence:** [Based on problem difficulties and time constraints]
- **Confidence:** [Low/Medium/High]
- **Recommendation:** [Actionable advice on when to use this strategy]
"""

async def _stream_simulate(req: SimulateContestRequest) -> AsyncGenerator[str, None]:
    provider = ProviderFactory.create(req.provider, api_key=req.api_key if req.api_key else None)
    prompt = _build_simulate_prompt(req)
    messages = [{"role": "user", "content": prompt}]
    
    try:
        async for chunk in provider.stream_chat(messages):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as exc:
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"
        yield "data: [DONE]\n\n"


def _build_chat_system_prompt(req: ReplayChatRequest) -> str:
    timeline_str = "\n".join(
        f"- {ev.time_minutes}m: [{ev.event}] Problem {ev.problem} - {ev.description}"
        for ev in req.contest.timeline
    )
    return f"""You are an AI Contest Replay Coach. Answer questions specifically about this contest.
    
Contest {req.contest.contest_id} Stats:
Solved: {req.contest.problems_solved}/{req.contest.problems_attempted}, Penalty: {req.contest.total_penalty_time}m

Timeline:
{timeline_str}

Rule: Always include Evidence, Reasoning, and actionable Recommendations in your answers.
"""

async def _stream_chat(req: ReplayChatRequest) -> AsyncGenerator[str, None]:
    provider = ProviderFactory.create(req.provider, api_key=req.api_key if req.api_key else None)
    
    messages = [{"role": "system", "content": _build_chat_system_prompt(req)}]
    for turn in req.conversation[-10:]:
        messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})
    messages.append({"role": "user", "content": req.message})
    
    try:
        async for chunk in provider.stream_chat(messages):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as exc:
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/analyze")
async def analyze_contest(req: AnalyzeContestRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream_analyze(req), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@router.post("/simulate")
async def simulate_contest(req: SimulateContestRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream_simulate(req), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@router.post("/chat")
async def chat_contest(req: ReplayChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream_chat(req), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )

@router.post("/personality")
async def analyze_personality(req: PersonalityRequest):
    # This endpoint returns a structured JSON for the Recharts Radar chart.
    cache_key = f"personality_{req.username}_{len(req.contests)}_{req.provider}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    provider = ProviderFactory.create(req.provider, api_key=req.api_key if req.api_key else None)
    
    prompt = f"""You are an elite competitive programming behavioral analyst.
Analyze the user's aggregate contest history across {len(req.contests)} recent contests to infer their 'Contest Personality'.

Contests Summary:
{json.dumps([{'solved': c.problems_solved, 'penalty': c.total_penalty_time, 'wasted': c.time_wasted_minutes} for c in req.contests])}

Output EXACTLY this JSON structure and nothing else:
{{
  "radar_data": [
    {{"trait": "Speed", "score": [0-100]}},
    {{"trait": "Accuracy", "score": [0-100]}},
    {{"trait": "Persistence", "score": [0-100]}},
    {{"trait": "Risk Tolerance", "score": [0-100]}},
    {{"trait": "Adaptability", "score": [0-100]}}
  ],
  "summary": "You are a [Fast Starter / Risk Taker etc] because... [2 sentences]"
}}
"""
    messages = [{"role": "user", "content": prompt}]
    
    full_text = ""
    try:
        # Instead of stream_chat, we could use a single call. But stream_chat is unified.
        async for chunk in provider.stream_chat(messages):
            full_text += chunk
        
        # Parse JSON
        import re
        json_match = re.search(r'\{.*\}', full_text, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(0))
            cache.set(cache_key, data)
            return data
        else:
            return {"radar_data": [], "summary": "Failed to generate personality."}
    except Exception as exc:
        return {"radar_data": [], "summary": f"Error: {str(exc)}"}

