import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  numericValue?: number;
  decimals?: number;
  hint?: string;
  accent?: "default" | "success" | "warning" | "danger";
  delay?: number;
}

const accentMap = {
  default: { color: "#67e8f9", glow: "rgba(34, 211, 238, 0.12)" },
  success: { color: "#34d399", glow: "rgba(52, 211, 153, 0.12)" },
  warning: { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.12)" },
  danger: { color: "#f87171", glow: "rgba(248, 113, 113, 0.12)" },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  numericValue,
  decimals = 0,
  hint,
  accent = "default",
  delay = 0,
}: StatCardProps) {
  const { color, glow } = accentMap[accent];

  return (
    <GlassCard className="stat-card" delay={delay}>
      <div className="stat-card__inner" style={{ background: glow }}>
        <div className="stat-card__icon" style={{ color, borderColor: `${color}40` }}>
          <Icon size={17} strokeWidth={2.25} />
        </div>
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value" style={{ color: numericValue !== undefined ? color : undefined }}>
          {numericValue !== undefined ? (
            <AnimatedCounter value={numericValue} decimals={decimals} />
          ) : (
            value
          )}
        </div>
        {hint ? <div className="stat-card__hint">{hint}</div> : null}
      </div>
    </GlassCard>
  );
}
