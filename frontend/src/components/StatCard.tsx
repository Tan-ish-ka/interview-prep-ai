import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value?: number | string;
  numericValue?: number;
  decimals?: number;
  hint?: string;
  accent?: "default" | "success" | "warning" | "danger";
  delay?: number;
}

const accentMap = {
  default: { 
    color: "#67e8f9", 
    glow: "rgba(34, 211, 238, 0.15)",
    glass: "cyan" as const,
  },
  success: { 
    color: "#6ee7b7", 
    glow: "rgba(52, 211, 153, 0.15)",
    glass: "green" as const,
  },
  warning: { 
    color: "#fbbf24", 
    glow: "rgba(251, 191, 36, 0.15)",
    glass: "orange" as const,
  },
  danger: { 
    color: "#f87171", 
    glow: "rgba(248, 113, 113, 0.15)",
    glass: "purple" as const,
  },
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
  const { color, glow, glass } = accentMap[accent];

  return (
    <GlassCard className="stat-card" delay={delay} accent={glass}>
      <div className="stat-card__inner" style={{ background: glow }}>
        <div className="stat-card__icon" style={{ color, borderColor: `${color}60` }}>
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div>
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
      </div>
    </GlassCard>
  );
}
