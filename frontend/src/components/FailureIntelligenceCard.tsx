
import { AlertCircle, TerminalSquare, Clock, XOctagon, Target, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { FailureIntelligence } from "../types/report";

interface FailureIntelligenceCardProps {
  data?: FailureIntelligence;
}

export function FailureIntelligenceCard({ data }: FailureIntelligenceCardProps) {
  if (!data || data.total_submissions === 0) return null;

  return (
    <GlassCard delay={0.4} className="p-8" accent="default">
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-400/20">
          <Target className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Failure Intelligence</h3>
          <p className="text-xs text-gray-500 mt-0.5">Root cause analysis of failed submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-gray-400 text-xs mb-1">WA Rate</div>
          <div className="text-xl font-bold text-rose-400">{data.verdict_rates["WRONG_ANSWER"] || 0}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-gray-400 text-xs mb-1">TLE Rate</div>
          <div className="text-xl font-bold text-amber-400">{data.verdict_rates["TIME_LIMIT_EXCEEDED"] || 0}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-gray-400 text-xs mb-1">RE Rate</div>
          <div className="text-xl font-bold text-purple-400">{data.verdict_rates["RUNTIME_ERROR"] || 0}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="text-gray-400 text-xs mb-1">Avg Attempts</div>
          <div className="text-xl font-bold text-white">{data.average_attempts_before_ac}</div>
        </div>
      </div>

      {data.root_causes.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Inferred Root Causes</h4>
          {data.root_causes.map((cause, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-rose-500/5 border border-rose-400/15">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-bold text-white flex items-center gap-2">
                  {cause.issue.includes("Time") ? <Clock className="w-4 h-4 text-amber-400" /> :
                   cause.issue.includes("Compilation") ? <TerminalSquare className="w-4 h-4 text-gray-400" /> :
                   cause.issue.includes("Runtime") ? <AlertCircle className="w-4 h-4 text-purple-400" /> :
                   <XOctagon className="w-4 h-4 text-rose-400" />}
                  {cause.issue}
                </h5>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                  {cause.confidence_score}% Confidence
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                <span className="text-gray-500">Cause:</span> {cause.inferred_cause}
              </p>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-cyan-500/5 border border-cyan-400/10">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-sm text-cyan-100/80">{cause.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
