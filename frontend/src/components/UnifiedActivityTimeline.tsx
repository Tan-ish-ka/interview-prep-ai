import { GlassCard } from "./GlassCard";
import type { UnifiedProfileResponse } from "../types/report";
import { History, Code2, Terminal, TrophyIcon } from "lucide-react";

interface Props {
  data: UnifiedProfileResponse;
}

export function UnifiedActivityTimeline({ data }: Props) {
  const { timeline } = data;
  
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'codeforces': return <Code2 className="w-4 h-4 text-blue-400" />;
      case 'leetcode': return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'codechef': return <TrophyIcon className="w-4 h-4 text-emerald-400" />;
      default: return <History className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBadgeColor = (platform: string) => {
    switch (platform) {
      case 'codeforces': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'leetcode': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case 'codechef': return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <GlassCard className="p-6" accent="default">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/20">
          <History className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Unified Activity Timeline</h2>
          <p className="text-sm text-gray-400">Chronological feed of your recent problem solving and contests</p>
        </div>
      </div>
      
      {(!timeline || timeline.length === 0) ? (
        <div className="text-center py-12 border border-dashed border-slate-700 rounded-xl">
          <p className="text-gray-400">No recent activity found.</p>
        </div>
      ) : (
        <div className="relative border-l border-slate-700/50 ml-4 space-y-6 pb-4">
          {timeline.map((event, i) => (
            <div key={i} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600" />
              
              <div className="bg-slate-800/20 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-200">{event.name}</h4>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getBadgeColor(event.platform)} capitalize flex items-center gap-1.5`}>
                      {getIcon(event.platform)}
                      {event.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 capitalize">
                      {event.type}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {event.verdict}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
