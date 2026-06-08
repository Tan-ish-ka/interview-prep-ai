import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Sparkles,
  Sprout,
  Target,
} from "lucide-react";
import type { PotentialEfficiency } from "../types/report";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";
import { TrendChip } from "./TrendChip";

interface PotentialEfficiencyCardProps {
  data: PotentialEfficiency;
  delay?: number;
}

const GROWTH_CLASS: Record<string, string> = {
  "High potential": "growth-badge--high",
  "Moderate potential": "growth-badge--moderate",
  "Needs more consistency": "growth-badge--consistency",
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "improving") {
    return <ArrowUpRight size={14} />;
  }
  if (trend === "declining") {
    return <ArrowDownRight size={14} />;
  }
  return <Minus size={14} />;
}

export function PotentialEfficiencyCard({
  data,
  delay = 0.17,
}: PotentialEfficiencyCardProps) {
  const growthClass = GROWTH_CLASS[data.growth_potential] ?? "growth-badge--moderate";

  return (
    <GlassCard className="section-card section-card--potential" delay={delay}>
      <div className="section-card__header">
        <Sparkles size={22} />
        <div>
          <h2>Potential &amp; Efficiency</h2>
          <p className="section-card__desc">
            How effectively practice converts into progress
          </p>
        </div>
      </div>

      <div className="potential-efficiency-grid">
        <section className="potential-panel potential-panel--efficiency">
          <div className="potential-panel__label">
            <Target size={16} />
            <span>Efficiency Score</span>
          </div>
          <div className="potential-efficiency-ring">
            <div
              className="potential-efficiency-ring__track"
              style={{ "--progress": `${data.efficiency_score}%` } as React.CSSProperties}
            >
              <AnimatedCounter value={data.efficiency_score} />
            </div>
            <TrendChip trend={data.efficiency_trend} />
          </div>
          <p className="potential-panel__summary">{data.efficiency_summary}</p>
          <div className="potential-trend-note">
            <TrendIcon trend={data.efficiency_trend} />
            <span>
              {data.efficiency_trend === "improving"
                ? "Conversion trend is positive"
                : data.efficiency_trend === "declining"
                  ? "Conversion trend needs attention"
                  : "Conversion trend is steady"}
            </span>
          </div>
        </section>

        <section className="potential-panel potential-panel--growth">
          <div className="potential-panel__label">
            <Sprout size={16} />
            <span>Growth Potential</span>
          </div>
          <span className={`growth-badge ${growthClass}`}>{data.growth_potential}</span>
          <p className="potential-panel__reason">{data.growth_reason}</p>
          <div className="potential-growth-meter" aria-hidden>
            <motion.div
              className="potential-growth-meter__fill"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  data.growth_potential === "High potential"
                    ? 82
                    : data.growth_potential === "Moderate potential"
                      ? 58
                      : 34
                }%`,
              }}
              transition={{ duration: 0.8, delay: delay + 0.1 }}
            />
          </div>
        </section>
      </div>

      <div className="potential-guidance">
        <GuidanceTile
          title="Why this score?"
          text={data.guidance.why_this_score}
          index={0}
          delay={delay}
        />
        <GuidanceTile
          title="What to improve next"
          text={data.guidance.what_to_improve_next}
          index={1}
          delay={delay}
        />
        <GuidanceTile
          title="Confidence builders"
          text={data.guidance.confidence_builders}
          index={2}
          delay={delay}
        />
      </div>
    </GlassCard>
  );
}

function GuidanceTile({
  title,
  text,
  index,
  delay,
}: {
  title: string;
  text: string;
  index: number;
  delay: number;
}) {
  return (
    <motion.div
      className="potential-guidance__tile"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.12 + index * 0.05 }}
    >
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}
