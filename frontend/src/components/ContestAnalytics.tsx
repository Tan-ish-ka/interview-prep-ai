import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Medal } from "lucide-react";
import type { ContestStats } from "../types/report";
import { StatCard } from "./StatCard";

interface ContestAnalyticsProps {
  stats: ContestStats;
}

export function ContestAnalytics({ stats }: ContestAnalyticsProps) {
  const chartData = [
    { name: "Total", value: stats.total_contests },
    { name: "Last 30d", value: stats.contests_last_30_days },
  ];

  return (
    <section className="glass-card section-card">
      <div className="section-card__header">
        <Medal size={22} />
        <h2>Contest analytics</h2>
      </div>
      <div className="stat-grid">
        <StatCard icon={Medal} label="Total contests" value={String(stats.total_contests)} />
        <StatCard
          icon={Medal}
          label="Last 30 days"
          value={String(stats.contests_last_30_days)}
        />
        <StatCard
          icon={Medal}
          label="Avg rating change"
          value={
            stats.average_rating_change !== null
              ? stats.average_rating_change.toFixed(1)
              : "—"
          }
          hint="Per contest"
        />
      </div>
      <div className="mini-chart" style={{ marginTop: "1.25rem" }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "rgba(15, 23, 42, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
              }}
            />
            <Bar dataKey="value" fill="url(#contestGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="contestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
