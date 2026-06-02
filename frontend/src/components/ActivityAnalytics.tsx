import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Zap } from "lucide-react";
import type { ActivityStats } from "../types/report";
import { StatCard } from "./StatCard";

interface ActivityAnalyticsProps {
  stats: ActivityStats;
  recentActivity: number;
}

export function ActivityAnalytics({ stats, recentActivity }: ActivityAnalyticsProps) {
  const chartData = [
    { period: "30 days", problems: stats.problems_last_30_days },
    { period: "90 days", problems: stats.problems_last_90_days },
  ];

  return (
    <section className="glass-card section-card">
      <div className="section-card__header">
        <Zap size={22} />
        <h2>Activity analytics</h2>
      </div>
      <div className="stat-grid">
        <StatCard
          icon={Zap}
          label="Last 30 days"
          value={String(stats.problems_last_30_days)}
        />
        <StatCard
          icon={Zap}
          label="Last 90 days"
          value={String(stats.problems_last_90_days)}
        />
        <StatCard
          icon={Zap}
          label="Per week (avg)"
          value={stats.average_problems_per_week.toFixed(1)}
          hint="90-day window"
        />
        <StatCard icon={Zap} label="Recent activity" value={String(recentActivity)} hint="30-day count" />
      </div>
      <div className="mini-chart" style={{ marginTop: "1.25rem" }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="period" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="problems" fill="url(#activityGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
