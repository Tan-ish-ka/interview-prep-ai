"""Deterministic engine for matching User Topic Coverage vs Company Knowledge Base."""

from __future__ import annotations
from typing import Any
from interview_prep_ai.interview_preparation.company_intelligence import COMPANY_KNOWLEDGE_BASE

def _clamp(val: float) -> int:
    return max(0, min(100, int(round(val))))

def _normalize_tag(tag: str) -> str:
    """Normalize tags so 'Dynamic Programming' matches 'dynamic programming' or 'dp'."""
    t = tag.lower().strip()
    if t in ["dp", "dynamic programming"]:
        return "dynamic programming"
    if t in ["graph", "graphs"]:
        return "graphs"
    if t in ["tree", "trees", "binary tree"]:
        return "trees"
    if t in ["array", "arrays"]:
        return "arrays"
    if t in ["string", "strings"]:
        return "strings"
    if t in ["hash table", "hash map", "hashing", "hash maps"]:
        return "hash table"
    if t in ["math", "mathematics"]:
        return "math"
    if t in ["sliding window"]:
        return "sliding window"
    if t in ["priority queue", "heap"]:
        return "priority queue"
    if t in ["linked list", "linked lists"]:
        return "linked lists"
    if t in ["design", "ood"]:
        return "design"
    return t

def calculate_company_readiness(insights: dict[str, Any]) -> list[dict[str, Any]]:
    """Calculates deterministic readiness for each company in the KB."""
    
    tag_frequency = insights.get("tag_frequency", {})
    
    # Normalize user tags
    normalized_user_tags = {}
    for raw_tag, count in tag_frequency.items():
        norm_tag = _normalize_tag(raw_tag)
        normalized_user_tags[norm_tag] = normalized_user_tags.get(norm_tag, 0) + count
    
    results = []
    
    for company in COMPANY_KNOWLEDGE_BASE:
        expected_topics = company["expected_topics"]
        
        topic_radar: dict[str, int] = {}
        gap_analysis = []
        
        total_weight = 0.0
        weighted_score = 0.0
        
        for topic, config in expected_topics.items():
            weight = config["weight"]
            target_solved = config["target_solved"]
            
            norm_topic = _normalize_tag(topic)
            user_solved = normalized_user_tags.get(norm_topic, 0)
            
            coverage = min(100, int((user_solved / target_solved) * 100)) if target_solved > 0 else 100
            topic_radar[topic] = coverage
            
            total_weight += weight
            weighted_score += weight * coverage
            
            if coverage < 100:
                gap = target_solved - user_solved
                recommendation = f"Solve {gap} more {topic} problems to reach target."
                if coverage < 50:
                    recommendation += " Focus on foundational concepts first."
                    
                gap_analysis.append({
                    "topic": topic,
                    "current_coverage": coverage,
                    "target_coverage": 100,
                    "recommendation": recommendation
                })
        
        overall_readiness = _clamp(weighted_score / total_weight) if total_weight > 0 else 0
        
        if overall_readiness >= 80:
            level = "Interview Ready"
        elif overall_readiness >= 60:
            level = "Nearly Ready"
        elif overall_readiness >= 40:
            level = "Developing"
        else:
            level = "Early Stage"
            
        gap_analysis.sort(key=lambda x: x["current_coverage"])
        
        results.append({
            "company": company["name"],
            "category": company["category"],
            "overall_readiness": overall_readiness,
            "level": level,
            "topic_radar": topic_radar,
            "difficulty_distribution": company["difficulty_distribution"],
            "previous_questions": company["previous_questions"],
            "gap_analysis": gap_analysis
        })
        
    results.sort(key=lambda x: -x["overall_readiness"])
    
    return results
