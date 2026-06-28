from dataclasses import dataclass, field

from interview_prep_ai.core.enums import Platform
from interview_prep_ai.core.models.problem import ProblemRecord
from interview_prep_ai.core.models.submission import SubmissionRecord
from interview_prep_ai.core.models.tag_stat import TagStat


def _empty_rating_history() -> dict:
    return {"status": "OK", "result": []}


@dataclass
class UserProfile:
    username: str
    platform: Platform
    current_rating: int | None = None
    max_rating: int | None = None
    total_solved: int = 0
    solved_problems: list[ProblemRecord] = field(default_factory=list)
    tag_stats: list[TagStat] = field(default_factory=list)
    rating_history: dict = field(default_factory=_empty_rating_history)
    all_submissions: list[SubmissionRecord] = field(default_factory=list)
    platform_specific: dict = field(default_factory=dict)

def merge_profiles(profiles: list[UserProfile]) -> UserProfile:
    if not profiles:
        return UserProfile(username="Unknown", platform=Platform.UNIFIED)
    
    total_solved = sum(p.total_solved for p in profiles)
    
    # Merge tag stats
    tag_map = {}
    for p in profiles:
        for tag in p.tag_stats:
            key = tag.tag.lower()
            if key not in tag_map:
                tag_map[key] = TagStat(tag=tag.tag, solved_count=0, attempt_count=0)
            tag_map[key].solved_count += tag.solved_count
            tag_map[key].attempt_count += tag.attempt_count
            
    merged_tags = sorted(list(tag_map.values()), key=lambda t: t.solved_count, reverse=True)
    
    # Merge problems and submissions
    all_problems = []
    all_submissions = []
    
    for p in profiles:
        all_problems.extend(p.solved_problems)
        all_submissions.extend(p.all_submissions)
        
    username = " + ".join([p.username for p in profiles])
    
    return UserProfile(
        username=username,
        platform=Platform.UNIFIED,
        current_rating=profiles[0].current_rating if profiles else 0, # Just take the first one or leave 0
        max_rating=profiles[0].max_rating if profiles else 0,
        total_solved=total_solved,
        solved_problems=all_problems,
        tag_stats=merged_tags,
        rating_history=profiles[0].rating_history if profiles else {"status": "OK", "result": []},
        all_submissions=all_submissions
    )
