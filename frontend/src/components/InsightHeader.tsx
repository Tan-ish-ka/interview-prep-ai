import { motion } from "framer-motion";
import { Gauge, User } from "lucide-react";
import { computeInsightScore, insightLabel } from "../lib/insightScore";
import type { Insights, Profile } from "../types/report";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";
import { TrendChip } from "./TrendChip";

interface InsightHeaderProps {
  profile: Profile;
  insights: Insights;
}

export function InsightHeader({ profile, insights }: InsightHeaderProps) {
  const score = computeInsightScore(insights);
  const label = insightLabel(score);
  const progress = score;

  return (
    <GlassCard className="insight-header" hover={false}>
      <div className="insight-header__main">
        <div className="insight-header__profile">
          <div className="insight-header__avatar">
            <User size={28} />
          </div>
          <div>
            <p className="insight-header__eyebrow">{profile.platform}</p>
            <h2 className="insight-header__name">@{profile.username}</h2>
            <div className="insight-header__meta">
              <TrendChip trend={insights.rating_trend} />
              <span className="meta-pill">
                {insights.total_solved} solved
              </span>
            </div>
          </div>
        </div>

        <motion.div
          className="insight-score"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <div className="insight-score__ring" style={{ "--progress": `${progress}%` } as React.CSSProperties}>
            <Gauge size={22} className="insight-score__icon" />
            <AnimatedCounter value={score} />
          </div>
          <span className="insight-score__label">{label}</span>
          <span className="insight-score__caption">Insight score</span>
        </motion.div>
      </div>

      <div className="insight-header__metrics">
        <MetricBlock label="Current" value={insights.current_rating} />
        <MetricBlock label="Peak" value={insights.max_rating} />
        <MetricBlock label="Recent Δ" value={insights.recent_rating_delta} signed />
        <MetricBlock
          label="Contests (30d)"
          value={insights.contest_stats.contests_last_30_days}
        />
      </div>
    </GlassCard>
  );
}

function MetricBlock({
  label,
  value,
  signed = false,
}: {
  label: string;
  value: number | null;
  signed?: boolean;
}) {
  const display =
    value === null
      ? "—"
      : signed
        ? value > 0
          ? `+${value}`
          : `${value}`
        : String(value);

  return (
    <div className="metric-block">
      <span className="metric-block__label">{label}</span>
      <span className="metric-block__value">{display}</span>
      {typeof value === "number" && signed ? (
        <div className="metric-block__bar">
          <motion.div
            className="metric-block__bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.abs(value) / 2)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      ) : null}
    </div>
  );
}
