import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Medal } from "lucide-react";
import type { ContestStats } from "../types/report";
import { GlassCard } from "./GlassCard";
import { StatCard } from "./StatCard";

interface ContestAnalyticsProps {
  stats: ContestStats;
  delay?: number;
}

export function ContestAnalytics({ stats, delay = 0 }: ContestAnalyticsProps) {
  const chartData = [
    { name: "All time", value: stats.total_contests },
    { name: "30 days", value: stats.contests_last_30_days },
  ];

  return (
    <GlassCard className="section-card" delay={delay}>
      <div className="section-card__header">
        <Medal size={22} />
        <div>
          <h2>Contest analytics</h2>
          <p className="section-card__desc">Participation & rating swings</p>
        </div>
      </div>
      <div className="stat-grid stat-grid--compact">
        <StatCard icon={Medal} label="Total" value={stats.total_contests} numericValue={stats.total_contests} />
        <StatCard icon={Medal} label="Last 30d" value={stats.contests_last_30_days} numericValue={stats.contests_last_30_days} />
        <StatCard
          icon={Medal}
          label="Avg Δ / contest"
          value={stats.average_rating_change !== null ? stats.average_rating_change.toFixed(1) : "—"}
          numericValue={stats.average_rating_change ?? undefined}
          decimals={1}
        />
      </div>
      <div className="chart-panel chart-panel--compact">
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "rgba(12, 18, 32, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
              }}
            />
            <Bar dataKey="value" fill="url(#contestBar)" radius={[10, 10, 0, 0]} />
            <defs>
              <linearGradient id="contestBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
