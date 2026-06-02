import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Info,
  Lightbulb,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";

export type RecommendationPriority = "high" | "medium" | "low";

export interface PriorityMeta {
  priority: RecommendationPriority;
  label: string;
  icon: LucideIcon;
  className: string;
}

export function inferRecommendationPriority(text: string): PriorityMeta {
  const lower = text.toLowerCase();

  if (
    lower.includes("dipped") ||
    lower.includes("mistakes") ||
    (lower.includes("consistency") && lower.includes("increase")) ||
    lower.includes("declining") ||
    lower.includes("revisit core")
  ) {
    return {
      priority: "high",
      label: "High priority",
      icon: AlertTriangle,
      className: "rec-card--high",
    };
  }

  if (
    lower.includes("practice more") ||
    lower.includes("weekly") ||
    lower.includes("contests") ||
    lower.includes("foundational") ||
    lower.includes("broaden") ||
    lower.includes("volume")
  ) {
    return {
      priority: "medium",
      label: "Focus area",
      icon: lower.includes("contest") ? Calendar : lower.includes("topic") ? Target : BookOpen,
      className: "rec-card--medium",
    };
  }

  if (lower.includes("leverage") || lower.includes("strength")) {
    return {
      priority: "low",
      label: "Strength play",
      icon: Sparkles,
      className: "rec-card--low",
    };
  }

  if (lower.includes("rating")) {
    return {
      priority: "high",
      label: "Rating alert",
      icon: TrendingDown,
      className: "rec-card--high",
    };
  }

  return {
    priority: "low",
    label: "Insight",
    icon: Lightbulb,
    className: "rec-card--low",
  };
}

export function fallbackPriority(index: number, total: number): PriorityMeta {
  if (index === 0) {
    return {
      priority: "high",
      label: "Top action",
      icon: AlertTriangle,
      className: "rec-card--high",
    };
  }
  if (index < Math.ceil(total / 2)) {
    return {
      priority: "medium",
      label: "Focus area",
      icon: Target,
      className: "rec-card--medium",
    };
  }
  return {
    priority: "low",
    label: "Insight",
    icon: Info,
    className: "rec-card--low",
  };
}
