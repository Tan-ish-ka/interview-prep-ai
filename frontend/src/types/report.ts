export interface ReportResponse {
  profile: Profile;
  insights: Insights;
  recommendations: string[];
  interview_preparation: InterviewPreparation;
  failure_intelligence?: FailureIntelligence;
  learning_dna?: LearningDNA;
  hidden_potential?: HiddenPotential;
  contest_replays?: ContestReplay[];
  missed_opportunities?: MissedOpportunity[];
  contributions: Record<string, number>;
  activity_feed: ActivityEvent[];
  skill_matrix: Record<string, number>;
}

export interface ActivityEvent {
  type: string;
  name: string;
  platform: string;
  timestamp: string;
  verdict: string;
}

export interface ContestTimelineEvent {
  time_minutes: number;
  event: string;
  problem: string;
  description: string;
}

export interface ContestReplay {
  contest_id: string;
  problems_attempted: number;
  problems_solved: number;
  total_penalty_time: number;
  time_wasted_minutes: number;
  timeline: ContestTimelineEvent[];
  date: string;
}

export interface MissedOpportunity {
  contest_id: string;
  problem_id: string;
  topic: string;
  reason: string;
  difficulty: number;
  tags: string[];
  historical_solve_probability: number;
  estimated_solve_time: number;
  recommendation: string;
}

export interface DNATrait {
  trait: string;
  description: string;
  type: string;
  confidence_score: number;
  reason: string;
}

export interface LearningDNA {
  dna_traits: DNATrait[];
}

export interface HiddenPotential {
  current_rating: number;
  potential_rating: number;
  gap: number;
  reasons: string[];
  confidence_score: number;
}

export interface RootCause {
  issue: string;
  inferred_cause: string;
  recommendation: string;
  confidence_score: number;
  data_points: string[];
}

export interface FailureIntelligence {
  total_submissions: number;
  verdict_counts: Record<string, number>;
  verdict_rates: Record<string, number>;
  average_attempts_before_ac: number;
  root_causes: RootCause[];
}

export interface InterviewPreparation {
  interview_readiness_level: string;
  interview_focus_areas: InterviewFocusArea[];
  roadmap: RoadmapItem[];
  company_readiness: CompanyReadiness[];
}

export interface PreviousQuestion {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  frequency: string;
  year: string;
}

export interface GapAnalysisItem {
  topic: string;
  current_coverage: number;
  target_coverage: number;
  recommendation: string;
}

export interface CompanyReadiness {
  company: string;
  category: string;
  overall_readiness: number;
  level: string;
  topic_radar: Record<string, number>;
  difficulty_distribution: Record<string, number>;
  previous_questions: PreviousQuestion[];
  gap_analysis: GapAnalysisItem[];
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
  ai_insight?: AiInsight;
  platform_specific?: Record<string, any>;
}

export interface AiInsight {
  summary: string;
  strengths: string;
  growth_opportunity: string;
  recommendation: string;
  readiness_score: number;
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

export interface UnifiedSummary {
  totalSolved: number;
  uniqueSolved: number;
  contests: number;
  interviewReadiness: string;
  skillScore: number;
  momentumScore: number;
  activityScore: number;
  strongestPlatform: string;
  weakestPlatform: string;
}

export interface AIInsights {
  strongest_platform: string;
  weakest_platform: string;
  platform_recommendations: string;
  topic_gaps: string;
  interview_readiness_explanation: string;
  activity_observations: string;
}

export interface UnifiedPlatformData {
  profile: Profile;
  insights: Insights;
}

export interface UnifiedProfileResponse {
  username: string;
  summary: UnifiedSummary;
  platforms: Record<string, UnifiedPlatformData>;
  contributions: Record<string, number>;
  topicBreakdown: Record<string, Record<string, number>>;
  timeline: ActivityEvent[];
  aiInsights: AIInsights;
  companyReadiness: CompanyReadiness[];
}

export type AnyReportResponse = ReportResponse | UnifiedProfileResponse;
