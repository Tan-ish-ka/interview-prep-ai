import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TopicSectionProps {
  weakTopics: string[];
  strongTopics: string[];
  delay?: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: "easeOut" },
  }),
};

export function TopicSection({ weakTopics, strongTopics, delay = 0 }: TopicSectionProps) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={delay} className="mt-8">
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
            <Target className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Topic Coverage</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">Identified strengths and weaknesses</p>
          </div>
        </div>

        {weakTopics.length === 0 && strongTopics.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
            <p className="text-gray-500 italic">Not available for this platform.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Demonstrated Strengths</h3>
              </div>
              <div className="space-y-3">
                {strongTopics.length > 0 ? (
                  strongTopics.map((topic, i) => (
                    <div key={topic} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-sm font-medium text-gray-200">{topic}</span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">#{i + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No strong topics identified yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Areas for Improvement</h3>
              </div>
              <div className="space-y-3">
                {weakTopics.length > 0 ? (
                  weakTopics.map((topic) => (
                    <div key={topic} className="flex items-center p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <span className="text-sm text-gray-300">{topic}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No weak topics — great coverage!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
