import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "default" | "success" | "warning" | "danger";
}

const accentColors = {
  default: "var(--accent-end)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function StatCard({ icon: Icon, label, value, hint, accent = "default" }: StatCardProps) {
  return (
    <div className="glass-card stat-card">
      <div
        className="stat-card__icon"
        style={{ color: accentColors[accent], background: `${accentColors[accent]}18` }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {hint ? <div className="stat-card__hint">{hint}</div> : null}
    </div>
  );
}
