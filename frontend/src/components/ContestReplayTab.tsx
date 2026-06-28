import { motion } from "framer-motion";
import { History, TrendingUp, AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { ContestReplayCard } from "./ContestReplayCard";
import { ContestPersonalityCard } from "./ContestPersonalityCard";
import { staggerContainer } from "../lib/motion";
import type { ReportResponse, ContestReplay, MissedOpportunity } from "../types/report";

interface ContestReplayTabProps {
  report: ReportResponse;
}

export function ContestReplayTab({ report }: ContestReplayTabProps) {
  const replays = report.contest_replays || [];
  const missedOpportunities = report.missed_opportunities || [];

  if (replays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <History className="w-12 h-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-300">No Contest History</h3>
        <p className="text-gray-500 mt-2">Participate in contests to unlock replays and analysis.</p>
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" exit="hidden" className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <GlassCard delay={0.06} className="p-6" accent="cyan">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                <History className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-black text-white">Recent Contests</h3>
            </div>
            <div className="text-sm text-gray-400">
               Analyzed your {replays.length} most recent contests to find time-wasting patterns.
            </div>
         </GlassCard>

         <GlassCard delay={0.08} className="p-6" accent="orange">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-400/20">
                <TrendingUp className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-black text-white">Missed Opportunities</h3>
            </div>
            <div className="text-sm text-gray-400">
               Found {missedOpportunities.length} problems you skipped despite being strong in their topics.
            </div>
         </GlassCard>
      </div>

      {missedOpportunities.length > 0 && (
        <GlassCard delay={0.1} className="p-8" accent="orange">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Rating Growth Left on the Table</h3>
          <div className="space-y-4">
            {missedOpportunities.map((opp: MissedOpportunity, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <div className="p-2 rounded-xl bg-orange-500/10 shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                     <h4 className="font-bold text-white">Contest {opp.contest_id} - Problem {opp.problem_id}</h4>
                     <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">Diff: {opp.difficulty}</span>
                     <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">Solve Prob: {opp.historical_solve_probability}%</span>
                     <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">Est. Time: {opp.estimated_solve_time}m</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                     <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-400/20">
                       {opp.topic}
                     </span>
                     {opp.tags?.map((t: string) => (
                       <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                         {t}
                       </span>
                     ))}
                  </div>
                  <p className="text-gray-400 text-sm mb-2"><span className="text-gray-300 font-bold">Why skipped:</span> {opp.reason}</p>
                  <p className="text-cyan-400 text-sm"><span className="font-bold">Recommendation:</span> {opp.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Contest Personality Radar */}
      <ContestPersonalityCard replays={replays} username={report.profile.username} />

      {/* Timelines */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Contest Timelines</h3>
        {replays.map((replay: ContestReplay, idx: number) => (
          <ContestReplayCard 
            key={idx} 
            replay={replay} 
            username={report.profile.username}
            delay={0.12 + idx * 0.05} 
          />
        ))}
      </div>
    </motion.div>
  );
}
