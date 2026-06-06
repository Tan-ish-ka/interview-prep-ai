import { motion } from "framer-motion";
import { Gauge, TrendingUp, User } from "lucide-react";
import { momentumLabel, skillLabel } from "../lib/insightScore";
import type { Insights, Profile } from "../types/report";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";
import { TrendChip } from "./TrendChip";

interface InsightHeaderProps {
  profile: Profile;
  insights: Insights;
}

export function InsightHeader({ profile, insights }: InsightHeaderProps) {
  const skillScore = insights.skill_score;
  const momentumScore = insights.momentum_score;

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

        <div className="insight-header__scores">
          <ScoreRing
            score={skillScore}
            label={skillLabel(skillScore)}
            caption="Skill score"
            icon={<Gauge size={22} className="insight-score__icon" />}
            accent="indigo"
            delay={0.2}
          />
          <ScoreRing
            score={momentumScore}
            label={momentumLabel(momentumScore)}
            caption="Momentum score"
            icon={<TrendingUp size={22} className="insight-score__icon" />}
            accent="cyan"
            delay={0.3}
          />
        </div>
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

function ScoreRing({
  score,
  label,
  caption,
  icon,
  accent,
  delay,
}: {
  score: number;
  label: string;
  caption: string;
  icon: React.ReactNode;
  accent: "indigo" | "cyan";
  delay: number;
}) {
  return (
    <motion.div
      className={`insight-score insight-score--${accent}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring" }}
    >
      <div
        className="insight-score__ring"
        style={{ "--progress": `${score}%` } as React.CSSProperties}
      >
        {icon}
        <AnimatedCounter value={score} />
      </div>
      <span className="insight-score__label">{label}</span>
      <span className="insight-score__caption">{caption}</span>
    </motion.div>
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
