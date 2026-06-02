import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Zap } from "lucide-react";
import type { ActivityStats } from "../types/report";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";

interface ActivityAnalyticsProps {
  stats: ActivityStats;
  recentActivity: number;
  delay?: number;
}

export function ActivityAnalytics({ stats, recentActivity, delay = 0 }: ActivityAnalyticsProps) {
  const chartData = [
    { period: "30d", problems: stats.problems_last_30_days },
    { period: "90d", problems: stats.problems_last_90_days },
  ];

  return (
    <GlassCard className="section-card" delay={delay}>
      <div className="section-card__header">
        <Zap size={22} />
        <div>
          <h2>Activity analytics</h2>
          <p className="section-card__desc">Problem-solving volume</p>
        </div>
      </div>
      <div className="stat-grid stat-grid--compact">
        <StatCard icon={Zap} label="30 days" value={stats.problems_last_30_days} numericValue={stats.problems_last_30_days} />
        <StatCard icon={Zap} label="90 days" value={stats.problems_last_90_days} numericValue={stats.problems_last_90_days} />
        <StatCard
          icon={Zap}
          label="Per week"
          value={stats.average_problems_per_week.toFixed(1)}
          numericValue={stats.average_problems_per_week}
          decimals={1}
        />
      </div>
      <div className="activity-progress">
        <div className="activity-progress__row">
          <span>Weekly target (5+)</span>
          <span>{Math.min(100, Math.round((stats.average_problems_per_week / 5) * 100))}%</span>
        </div>
        <div className="activity-progress__track">
          <div
            className="activity-progress__fill"
            style={{ width: `${Math.min(100, (stats.average_problems_per_week / 5) * 100)}%` }}
          />
        </div>
      </div>
      <div className="chart-panel chart-panel--compact">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="period" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "rgba(12, 18, 32, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
              }}
            />
            <Bar dataKey="problems" fill="url(#activityBar)" radius={[10, 10, 0, 0]} />
            <defs>
              <linearGradient id="activityBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="section-footnote">Recent activity index: {recentActivity} solves (30d)</p>
    </GlassCard>
  );
}
