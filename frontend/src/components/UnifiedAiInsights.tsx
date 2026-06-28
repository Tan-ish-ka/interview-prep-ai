import { GlassCard } from "./GlassCard";
import type { UnifiedProfileResponse } from "../types/report";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";

interface Props {
  data: UnifiedProfileResponse;
}

export function UnifiedAiInsights({ data }: Props) {
  const { aiInsights } = data;

  return (
    <GlassCard className="p-6" accent="purple">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20">
          <Sparkles className="w-5 h-5 text-fuchsia-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Cross-Platform AI Insights</h2>
          <p className="text-sm text-gray-400">Synthesized observations across your competitive programming footprint</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Readiness */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-slate-200">Interview Readiness</h4>
          </div>
          <p className="text-sm text-slate-400">{aiInsights.interview_readiness_explanation}</p>
        </div>
        
        {/* Activity */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h4 className="font-bold text-slate-200">Activity Observations</h4>
          </div>
          <p className="text-sm text-slate-400">{aiInsights.activity_observations}</p>
        </div>

        {/* Topic Gaps */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-slate-200">Identified Gaps</h4>
          </div>
          <p className="text-sm text-slate-400">{aiInsights.topic_gaps}</p>
        </div>

        {/* Recommendations */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            <h4 className="font-bold text-slate-200">Next Steps</h4>
          </div>
          <p className="text-sm text-slate-400">{aiInsights.platform_recommendations}</p>
        </div>
        
      </div>
    </GlassCard>
  );
}
