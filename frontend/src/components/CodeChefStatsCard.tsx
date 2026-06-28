import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";
import { GlassCard } from "./GlassCard";
import type { ReportResponse } from "../types/report";
import { Target, Trophy, TrendingUp, Globe, MapPin, Star } from "lucide-react";

interface CodeChefStatsCardProps {
  report: ReportResponse;
  delay?: number;
}

export function CodeChefStatsCard({ report, delay = 0 }: CodeChefStatsCardProps) {
  const { platform_specific = {}, total_solved } = report.insights;

  const getMetric = (val: any) => val !== undefined && val !== null ? val : "Not available for this platform";

  return (
    <motion.div variants={fadeUp} custom={delay} className="col-span-1 lg:col-span-3">
      <GlassCard className="p-8 mb-8" accent="rose">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-400/20">
            <Trophy className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">CodeChef Analytics</h2>
            <p className="text-sm text-rose-200/60 mt-0.5">Competitive programming metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rating & Stars */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rating</span>
              <TrendingUp className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-black text-white mb-2">{report.insights.current_rating || 0}</p>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-amber-400">{getMetric(platform_specific.stars)}</span>
            </div>
            <p className="text-xs text-gray-400">
              Max: <span className="text-white">{report.insights.max_rating || 0}</span>
            </p>
          </div>

          {/* Ranks */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rankings</span>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">Global Rank</p>
                </div>
                <p className="text-xl font-bold text-white">{getMetric(platform_specific.global_rank)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">Country Rank</p>
                </div>
                <p className="text-xl font-bold text-white">{getMetric(platform_specific.country_rank)}</p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Activity</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Problems Solved</p>
                <p className="text-xl font-bold text-white">{total_solved}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Readiness</p>
                <p className="text-xl font-bold text-emerald-400">{report.interview_preparation.interview_readiness_level}</p>
              </div>
            </div>
          </div>

          {/* Additional space for symmetry */}
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.02] flex items-center justify-center">
            <p className="text-xs text-gray-600 italic">CodeChef detailed stats</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
