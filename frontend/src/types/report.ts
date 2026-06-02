export interface ReportResponse {
  profile: Profile;
  insights: Insights;
  recommendations: string[];
}

export interface Profile {
  username: string;
  platform: string;
  current_rating: number | null;
  max_rating: number | null;
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
  recent_activity: number;
  top_tags: Record<string, number>;
  weak_topics: string[];
  strong_topics: string[];
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
