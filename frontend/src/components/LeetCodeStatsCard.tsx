import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";
import { GlassCard } from "./GlassCard";
import type { ReportResponse } from "../types/report";
import { Target, Trophy, Code2, Calendar, Zap } from "lucide-react";

interface LeetCodeStatsCardProps {
  report: ReportResponse;
  delay?: number;
}

export function LeetCodeStatsCard({ report, delay = 0 }: LeetCodeStatsCardProps) {
  const { platform_specific = {}, total_solved } = report.insights;

  const getMetric = (val: any) => val !== undefined && val !== null ? val : "Not available for this platform";

  return (
    <motion.div variants={fadeUp} custom={delay} className="col-span-1 lg:col-span-3">
      <GlassCard className="p-8 mb-8" accent="amber">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20">
            <Code2 className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">LeetCode Analytics</h2>
            <p className="text-sm text-amber-200/60 mt-0.5">Problem solving metrics and contest stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Solved Problems Breakdown */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Solved</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white mb-4">{total_solved}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-medium">Easy</span>
                <span className="text-white font-bold">{getMetric(platform_specific.easy_solved)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-amber-400 font-medium">Medium</span>
                <span className="text-white font-bold">{getMetric(platform_specific.medium_solved)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-400 font-medium">Hard</span>
                <span className="text-white font-bold">{getMetric(platform_specific.hard_solved)}</span>
              </div>
            </div>
          </div>

          {/* Contest Stats */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contest Stats</span>
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Contest Rating</p>
                <p className="text-xl font-bold text-white">
                  {platform_specific.contest_rating ? Math.round(platform_specific.contest_rating) : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Global Ranking</p>
                <p className="text-xl font-bold text-white">
                  {platform_specific.contest_ranking ? `#${platform_specific.contest_ranking.toLocaleString()}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Consistency */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Consistency</span>
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Active Days</p>
                <p className="text-xl font-bold text-white">{getMetric(platform_specific.active_days)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Max Streak</p>
                <p className="text-xl font-bold text-white">{getMetric(platform_specific.submission_streak)}</p>
              </div>
            </div>
          </div>

          {/* Quality */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Accuracy</span>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Acceptance Rate</p>
                <p className="text-xl font-bold text-white">
                  {platform_specific.acceptance_rate !== undefined ? `${platform_specific.acceptance_rate}%` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Readiness</p>
                <p className="text-xl font-bold text-emerald-400">{report.interview_preparation.interview_readiness_level}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
