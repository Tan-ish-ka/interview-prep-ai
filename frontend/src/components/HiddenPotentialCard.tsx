import { Rocket, Info, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import type { HiddenPotential } from "../types/report";

interface HiddenPotentialCardProps {
  data?: HiddenPotential;
  delay?: number;
}

export function HiddenPotentialCard({ data, delay = 0.3 }: HiddenPotentialCardProps) {
  if (!data) return null;

  const progressPct = Math.min(100, Math.max(0, ((data.current_rating - 800) / (Math.max(data.potential_rating, 2000) - 800)) * 100));

  return (
    <GlassCard delay={delay} className="p-8" accent="orange">
      <div className="flex items-center gap-3 mb-7">
        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-400/20">
          <Rocket className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white">Hidden Potential</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your true estimated rating based on accuracy and volume</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wider">Current</div>
              <div className="text-3xl font-black text-white">{data.current_rating}</div>
            </div>
            
            <div className="flex flex-col items-center px-4">
              <span className="text-orange-400 text-sm font-bold bg-orange-500/10 px-3 py-1 rounded-full border border-orange-400/20">
                +{data.gap} Gap
              </span>
              <ChevronRight className="w-5 h-5 text-gray-600 mt-1" />
            </div>

            <div className="text-right">
              <div className="text-orange-400 text-xs mb-1 font-semibold uppercase tracking-wider">Potential</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                {data.potential_rating}
              </div>
            </div>
          </div>
          
          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mt-4 border border-white/5">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
            <div 
              className="absolute top-0 h-full w-px bg-white/50 z-10"
              style={{ left: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="md:w-1/3 w-full p-5 rounded-2xl bg-white/[0.02] border border-white/5">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Info className="w-4 h-4" />
            Why this potential?
          </h4>
          <ul className="space-y-3">
            {data.reasons.map((reason, idx) => (
              <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
