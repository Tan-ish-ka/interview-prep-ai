import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { fadeUp } from "../lib/motion";
import { GlassCard } from "./GlassCard";
import { usePlatforms } from "../contexts/PlatformContext";
import type { ReportResponse } from "../types/report";
import { Layers, Activity, Star, Trophy } from "lucide-react";

interface UnifiedProfileCardProps {
  report: ReportResponse;
  delay?: number;
}

const COLORS: Record<string, string> = {
  codeforces: "#ef4444",
  leetcode: "#f59e0b",
  codechef: "#8b5cf6",
};

export function UnifiedProfileCard({ report, delay = 0 }: UnifiedProfileCardProps) {
  const { connections } = usePlatforms();
  
  const connectedPlatforms = Object.entries(connections).filter(([_, data]) => data !== null);
  
  // Format data for Donut Chart
  const chartData = Object.entries(report.contributions || {}).map(([platform, percentage]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: percentage,
    platform,
  }));

  return (
    <motion.div variants={fadeUp} custom={delay}>
      <GlassCard className="p-8 mb-8" accent="indigo">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Unified Profile</h2>
            <p className="text-sm text-indigo-200/60 mt-0.5">Aggregated analytics across {connectedPlatforms.length} platforms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Individual Platform Breakdown */}
          <div className="col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Connected Accounts</h3>
            {connectedPlatforms.map(([platform, data]) => (
              <div key={platform} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white capitalize">{platform}</p>
                  <p className="text-xs text-gray-400">@{data?.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{data?.problemsSynced} <span className="text-[10px] text-gray-500 font-normal">solved</span></p>
                  <p className="text-xs font-medium text-emerald-400">{report.contributions?.[platform] ?? 0}% impact</p>
                </div>
              </div>
            ))}
            {connectedPlatforms.length === 0 && (
              <p className="text-sm text-gray-500 italic">No platforms connected.</p>
            )}
          </div>

          {/* Unified Totals & Chart */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex flex-col justify-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Weighted Contribution</h3>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.platform] || "#6366f1"} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value}%`, 'Contribution']}
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">{connectedPlatforms.length}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Platforms</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Unified Totals</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
                  <Activity className="w-4 h-4 text-indigo-400 mb-2" />
                  <p className="text-2xl font-black text-white">{report.profile.total_solved}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total Solved</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                  <Trophy className="w-4 h-4 text-emerald-400 mb-2" />
                  <p className="text-2xl font-black text-white">{report.insights.contest_stats.total_contests}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total Contests</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20">
                  <Layers className="w-4 h-4 text-cyan-400 mb-2" />
                  <p className="text-2xl font-black text-white">{report.insights.strong_topics.length + report.insights.weak_topics.length}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Topics Covered</p>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                  <Star className="w-4 h-4 text-purple-400 mb-2" />
                  <p className="text-xl font-black text-white">{report.interview_preparation.interview_readiness_level}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">Readiness</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
