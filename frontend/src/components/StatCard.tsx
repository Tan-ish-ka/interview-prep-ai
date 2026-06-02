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
  default: "#67e8f9",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
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
  const color = accentMap[accent];

  return (
    <GlassCard className="stat-card" delay={delay}>
      <div className="stat-card__icon" style={{ color, background: `${color}18` }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">
        {numericValue !== undefined ? (
          <AnimatedCounter value={numericValue} decimals={decimals} />
        ) : (
          value
        )}
      </div>
      {hint ? <div className="stat-card__hint">{hint}</div> : null}
    </GlassCard>
  );
}
