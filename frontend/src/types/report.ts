export interface ReportResponse {
  profile: Profile;
  insights: Insights;
  recommendations: string[];
  interview_preparation: InterviewPreparation;
}

export interface InterviewPreparation {
  interview_readiness_level: string;
  interview_focus_areas: InterviewFocusArea[];
  roadmap: RoadmapItem[];
  company_readiness: CompanyReadiness[];
}

export interface CompanyReadiness {
  company: string;
  category: string;
  score: number;
  level: string;
  reason: string;
  strong_topics: string[];
  missing_topics: string[];
}

export interface InterviewFocusArea {
  area: string;
  status: "weak" | "strong" | "neutral" | "needs_practice";
  solved_count: number;
}

export interface RoadmapItem {
  priority: number;
  category: string;
  title: string;
  description: string;
}

export interface Profile {
  username: string;
  platform: string;
  current_rating: number | null;
  max_rating: number | null;
  total_solved: number;
  solved_problems: unknown[];
  tag_stats: TagStat[];
  rating_history: Record<string, unknown>;
}

export interface TagStat {
  tag: string;
  solved_count: number;
  attempt_count: number;
}

export interface Insights {
  current_rating: number | null;
  max_rating: number | null;
  rating_delta: number | null;
  recent_rating_delta: number | null;
  rating_trend: string;
  contest_stats: ContestStats;
  activity_stats: ActivityStats;
  total_solved: number;
  solved_count_definition: string;
  recent_activity: number;
  top_tags: Record<string, number>;
  weak_topics: string[];
  strong_topics: string[];
  skill_score: number;
  momentum_score: number;
  potential_efficiency: PotentialEfficiency;
}

export interface PotentialEfficiency {
  efficiency_score: number;
  efficiency_trend: string;
  efficiency_summary: string;
  growth_potential: string;
  growth_reason: string;
  guidance: StudyGuidance;
}

export interface StudyGuidance {
  why_this_score: string;
  what_to_improve_next: string;
  confidence_builders: string;
}

export interface ContestStats {
  total_contests: number;
  contests_last_30_days: number;
  average_rating_change: number | null;
}

export interface ActivityStats {
  problems_last_30_days: number;
  problems_last_90_days: number;
  average_problems_per_week: number;
}
