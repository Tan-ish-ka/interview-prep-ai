import { Activity, TrendingDown, TrendingUp } from "lucide-react";
import { extractRatingTrend } from "../lib/ratingHistory";
import type { Insights, Profile } from "../types/report";
import { GlassCard } from "./GlassCard";
import { RatingTrendChart } from "./RatingTrendChart";
import { StatCard } from "./StatCard";
import { TrendChip } from "./TrendChip";

interface RatingAnalyticsProps {
  profile: Profile;
  insights: Insights;
  delay?: number;
}

function formatDelta(value: number | null): string {
  if (value === null) return "—";
  return value > 0 ? `+${value}` : `${value}`;
}

export function RatingAnalytics({ profile, insights, delay = 0 }: RatingAnalyticsProps) {
  const chartData = extractRatingTrend(profile.rating_history);
  const recentAccent =
    insights.recent_rating_delta !== null && insights.recent_rating_delta < 0
      ? "danger"
      : insights.recent_rating_delta !== null && insights.recent_rating_delta > 0
        ? "success"
        : "default";

  return (
    <GlassCard className="section-card section-card--chart" delay={delay}>
      <div className="section-card__header">
        <TrendingUp size={22} />
        <div>
          <h2>Rating analytics</h2>
          <p className="section-card__desc">Contest rating trajectory & deltas</p>
        </div>
        <TrendChip trend={insights.rating_trend} />
      </div>

      <div className="chart-panel">
        <RatingTrendChart data={chartData} />
      </div>

      <div className="stat-grid">
        <StatCard
          icon={TrendingUp}
          label="Current"
          value={insights.current_rating?.toString() ?? "—"}
          numericValue={insights.current_rating ?? undefined}
          delay={delay + 0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Peak"
          value={insights.max_rating?.toString() ?? "—"}
          numericValue={insights.max_rating ?? undefined}
          delay={delay + 0.08}
        />
        <StatCard
          icon={Activity}
          label="Lifetime Δ"
          value={formatDelta(insights.rating_delta)}
          hint="First → latest"
          delay={delay + 0.11}
        />
        <StatCard
          icon={TrendingDown}
          label="Recent Δ"
          value={formatDelta(insights.recent_rating_delta)}
          hint="Last contest"
          accent={recentAccent}
          delay={delay + 0.14}
        />
      </div>
    </GlassCard>
  );
}
