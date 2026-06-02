import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import type { Insights } from "../types/report";
import { StatCard } from "./StatCard";

interface RatingAnalyticsProps {
  insights: Insights;
}

function formatDelta(value: number | null): string {
  if (value === null) return "—";
  return value > 0 ? `+${value}` : `${value}`;
}

function TrendBadge({ trend }: { trend: string }) {
  const Icon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Activity;
  return (
    <span className={`trend-badge trend-badge--${trend}`}>
      <Icon size={14} />
      {trend}
    </span>
  );
}

export function RatingAnalytics({ insights }: RatingAnalyticsProps) {
  const recentAccent =
    insights.recent_rating_delta !== null && insights.recent_rating_delta < 0
      ? "danger"
      : insights.recent_rating_delta !== null && insights.recent_rating_delta > 0
        ? "success"
        : "default";

  return (
    <section className="glass-card section-card">
      <div className="section-card__header">
        <TrendingUp size={22} />
        <h2>Rating analytics</h2>
        <TrendBadge trend={insights.rating_trend} />
      </div>
      <div className="stat-grid">
        <StatCard
          icon={TrendingUp}
          label="Current rating"
          value={insights.current_rating?.toString() ?? "—"}
        />
        <StatCard
          icon={TrendingUp}
          label="Max rating"
          value={insights.max_rating?.toString() ?? "—"}
        />
        <StatCard
          icon={Activity}
          label="Lifetime change"
          value={formatDelta(insights.rating_delta)}
          hint="First contest → latest"
        />
        <StatCard
          icon={TrendingDown}
          label="Recent change"
          value={formatDelta(insights.recent_rating_delta)}
          hint="Last contest"
          accent={recentAccent}
        />
      </div>
    </section>
  );
}
