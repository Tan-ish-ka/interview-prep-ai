"""Problems API router for similar problem recommendations."""

from __future__ import annotations
import json
import random
from pathlib import Path
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/problems", tags=["problems"])

_PROBLEMS_DB_PATH = Path(__file__).resolve().parents[3] / "data" / "problems_db.json"

def _load_problems() -> list[dict]:
    if _PROBLEMS_DB_PATH.exists():
        try:
            return json.loads(_PROBLEMS_DB_PATH.read_text(encoding="utf-8"))
        except Exception:
            return []
    return []

class SimilarProblemResponse(BaseModel):
    id: str
    title: str
    platform: str
    difficulty: str
    tags: list[str]

@router.get("/similar", response_model=list[SimilarProblemResponse])
async def get_similar_problems(
    tags: str = Query(..., description="Comma-separated list of tags to match"),
    difficulty: str = Query(None, description="Preferred difficulty level (Easy, Medium, Hard)")
):
    all_problems = _load_problems()
    
    target_tags = {t.strip().lower() for t in tags.split(",") if t.strip()}
    target_difficulty = difficulty.lower() if difficulty else None
    
    scored_problems = []
    
    for p in all_problems:
        p_tags = {t.lower() for t in p.get("tags", [])}
        overlap = len(target_tags.intersection(p_tags))
        
        # We need at least some overlap to consider it similar, unless target_tags is empty
        if not target_tags or overlap > 0:
            score = overlap * 10
            
            p_diff = p.get("difficulty", "").lower()
            if target_difficulty and p_diff == target_difficulty:
                score += 5
                
            scored_problems.append((score, p))
            
    # Sort by score descending, then shuffle slightly for variety among same scores
    scored_problems.sort(key=lambda x: (-x[0], random.random()))
    
    # Return top 5
    top_matches = [p[1] for p in scored_problems[:5]]
    
    return [
        SimilarProblemResponse(
            id=p.get("id", ""),
            title=p.get("title", ""),
            platform=p.get("platform", ""),
            difficulty=p.get("difficulty", ""),
            tags=p.get("tags", [])
        )
        for p in top_matches
    ]
