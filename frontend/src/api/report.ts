import type { ReportResponse } from "../types/report";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function fetchReport(profileUrl: string): Promise<ReportResponse> {
  const params = new URLSearchParams({ url: profileUrl.trim() });
  const response = await fetch(`${API_BASE}/report?${params}`);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string | unknown[] };
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((item) => JSON.stringify(item)).join("; ");
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<ReportResponse>;
}

export interface ComparisonResponse {
  profile_a: { username: string; insights: any };
  profile_b: { username: string; insights: any };
  head_to_head: {
    skill: string;
    consistency: string;
    activity: string;
    summary: string;
  };
  metric_comparison: {
    [key: string]: {
      value_a: any;
      value_b: any;
      difference?: any;
      percentage_gap?: number;
      winner?: string;
    };
  };
  topic_comparison: Array<{
    topic: string;
    count_a: number;
    count_b: number;
    winner: string;
  }>;
  topic_summary: {
    stronger_for_a: string[];
    stronger_for_b: string[];
    mutual_weaknesses: string[];
    missing_in_a: string[];
    missing_in_b: string[];
  };
  improvement_insights: {
    improvement_areas: Array<{
      type: string;
      name: string;
      reason: string;
    }>;
    estimated_skill_score_improvement: number;
  };
}

export async function fetchComparison(handleA: string, handleB: string): Promise<ComparisonResponse> {
  const params = new URLSearchParams({ handle_a: handleA.trim(), handle_b: handleB.trim() });
  const response = await fetch(`${API_BASE}/compare?${params}`);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string | unknown[] };
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((item) => JSON.stringify(item)).join("; ");
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<ComparisonResponse>;
}

export interface PlatformsResponse {
  username: string;
  platforms: {
    [key: string]: {
      profile: {
        username: string;
        platform: string;
        current_rating: number | null;
        max_rating: number | null;
        total_solved: number;
      };
      insights: any;
    };
  };
  total_solved: number;
  skill_score: number;
  momentum_score: number;
  interview_readiness: string;
  growth_potential: string;
  strong_topics: string[];
  weak_topics: string[];
}

export async function fetchPlatformsAnalysis(
  codeforcesHandle: string,
  leetcodeHandle = "",
  codechefHandle = ""
): Promise<PlatformsResponse> {
  const params = new URLSearchParams({
    codeforces_handle: codeforcesHandle.trim(),
    leetcode_handle: leetcodeHandle.trim(),
    codechef_handle: codechefHandle.trim()
  });
  const response = await fetch(`${API_BASE}/platforms/analysis?${params}`);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string | unknown[] };
      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (Array.isArray(body.detail)) {
        message = body.detail.map((item) => JSON.stringify(item)).join("; ");
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json() as Promise<PlatformsResponse>;
}
