import { Brain, Star, TrendingUp, AlertTriangle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { LearningDNA } from "../types/report";

interface LearningDNACardProps {
  data?: LearningDNA;
  delay?: number;
}

export function LearningDNACard({ data, delay = 0.2 }: LearningDNACardProps) {
  if (!data || !data.dna_traits || data.dna_traits.length === 0) return null;

  return (
    <GlassCard delay={delay} className="p-8" accent="cyan">
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
          <Brain className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Learning DNA</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your unique algorithmic profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.dna_traits.map((trait, idx) => {
          const isStrength = trait.type === "strength";
          const isWeakness = trait.type === "weakness";
          
          return (
            <div key={idx} className={`p-5 rounded-2xl border transition-all ${
              isStrength ? "bg-cyan-500/5 border-cyan-400/15" :
              isWeakness ? "bg-rose-500/5 border-rose-400/15" :
              "bg-purple-500/5 border-purple-400/15"
            }`}>
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                  {isStrength ? <Star className="w-4 h-4 text-cyan-400" /> :
                   isWeakness ? <AlertTriangle className="w-4 h-4 text-rose-400" /> :
                   <TrendingUp className="w-4 h-4 text-purple-400" />}
                  {trait.trait}
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isStrength ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/20" :
                  isWeakness ? "bg-rose-500/10 text-rose-400 border-rose-400/20" :
                  "bg-purple-500/10 text-purple-400 border-purple-400/20"
                }`}>
                  {trait.confidence_score}% Match
                </span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                {trait.description}
              </p>
              <div className={`p-3 rounded-xl border text-xs ${
                  isStrength ? "bg-cyan-500/5 border-cyan-400/10 text-cyan-200/80" :
                  isWeakness ? "bg-rose-500/5 border-rose-400/10 text-rose-200/80" :
                  "bg-purple-500/5 border-purple-400/10 text-purple-200/80"
              }`}>
                <span className="font-semibold block mb-1">Reason:</span> {trait.reason}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
