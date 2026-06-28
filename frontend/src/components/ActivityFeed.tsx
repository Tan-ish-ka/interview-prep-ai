import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";
import { GlassCard } from "./GlassCard";
import type { ReportResponse } from "../types/report";
import { Activity, Code2, Trophy } from "lucide-react";

interface ActivityFeedProps {
  report: ReportResponse;
  delay?: number;
}

export function ActivityFeed({ report, delay = 0 }: ActivityFeedProps) {
  const { activity_feed } = report;

  if (!activity_feed || activity_feed.length === 0) {
    return null;
  }

  return (
    <motion.div variants={fadeUp} custom={delay} className="col-span-1 lg:col-span-2">
      <GlassCard className="p-6 h-full" accent="blue">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Cross-Platform Activity Feed</h3>
            <p className="text-xs text-blue-200/60 mt-0.5">Recent verified events</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {activity_feed.map((event, idx) => {
            const isContest = event.type === "contest";
            const date = new Date(event.timestamp);
            
            return (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
              >
                <div className={`p-2 rounded-lg ${isContest ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {isContest ? <Trophy className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-white truncate">{event.name}</h4>
                    <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                      {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded bg-white/5 text-gray-300">
                      {event.platform}
                    </span>
                    <span className={`text-xs font-bold ${isContest ? 'text-amber-400' : (event.verdict === 'OK' || event.verdict === 'Accepted' ? 'text-emerald-400' : 'text-red-400')}`}>
                      {event.verdict}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
