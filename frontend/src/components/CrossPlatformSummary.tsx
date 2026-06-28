
import { GlassCard } from "./GlassCard";
import { Target, Trophy, Layers, Activity, Star, TrendingUp } from "lucide-react";
import type { UnifiedProfileResponse } from "../types/report";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: UnifiedProfileResponse;
}

const COLORS = {
  codeforces: "#3b82f6", // blue
  leetcode: "#f59e0b", // amber
  codechef: "#10b981", // emerald
};

export function CrossPlatformSummary({ data }: Props) {
  const { summary, contributions } = data;
  
  const pieData = Object.entries(contributions).map(([platform, value]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value,
    color: COLORS[platform as keyof typeof COLORS] || "#8b5cf6"
  }));

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-6" accent="purple">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Solved</span>
          </div>
          <div className="text-3xl font-black text-white">{summary.totalSolved}</div>
          <p className="text-xs text-purple-300/70 mt-1">{summary.uniqueSolved} unique problems</p>
        </GlassCard>

        <GlassCard className="p-6" accent="cyan">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
              <Star className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Skill Score</span>
          </div>
          <div className="text-3xl font-black text-white">{summary.skillScore}</div>
          <p className="text-xs text-cyan-300/70 mt-1">/ 100 overall rating</p>
        </GlassCard>

        <GlassCard className="p-6" accent="emerald">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Readiness</span>
          </div>
          <div className="text-2xl font-black text-white truncate">{summary.interviewReadiness}</div>
          <p className="text-xs text-emerald-300/70 mt-1">Interview readiness level</p>
        </GlassCard>

        <GlassCard className="p-6" accent="amber">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Momentum</span>
          </div>
          <div className="text-3xl font-black text-white">{summary.momentumScore}</div>
          <p className="text-xs text-amber-300/70 mt-1">/ 100 consistency</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 md:col-span-1 flex flex-col items-center justify-center min-h-[250px]" accent="indigo">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 self-start w-full text-center">Platform Contribution</h3>
          <div className="w-full h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [`${value}%`, 'Contribution']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
             {pieData.map(entry => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
             ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2 flex flex-col justify-center" accent="blue">
           <h3 className="text-lg font-bold text-white mb-6">Cross-Platform Insights</h3>
           <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-400 mb-1">Strongest Platform</p>
                <p className="text-2xl font-black text-white capitalize">{summary.strongestPlatform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Weakest Platform</p>
                <p className="text-2xl font-black text-white capitalize">{summary.weakestPlatform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Contests</p>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <p className="text-2xl font-black text-white">{summary.contests}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Activity Score</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <p className="text-2xl font-black text-white">{summary.activityScore} / 100</p>
                </div>
              </div>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
