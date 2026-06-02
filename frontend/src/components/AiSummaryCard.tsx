import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { buildAiSummary } from "../lib/aiSummary";
import type { Insights, Profile } from "../types/report";
import { GlassCard } from "./GlassCard";

interface AiSummaryCardProps {
  profile: Profile;
  insights: Insights;
  recommendationCount: number;
  delay?: number;
}

export function AiSummaryCard({
  profile,
  insights,
  recommendationCount,
  delay = 0.04,
}: AiSummaryCardProps) {
  const { headline, narrative, highlights } = buildAiSummary(
    profile,
    insights,
    recommendationCount,
  );

  return (
    <GlassCard className="ai-summary" delay={delay} hover={false}>
      <div className="ai-summary__glow" aria-hidden />
      <div className="ai-summary__header">
        <div className="ai-summary__icon">
          <Bot size={22} />
        </div>
        <div>
          <p className="ai-summary__eyebrow">
            <Sparkles size={12} />
            AI executive summary
          </p>
          <h2 className="ai-summary__headline">{headline}</h2>
        </div>
      </div>
      <motion.p
        className="ai-summary__narrative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.15 }}
      >
        {narrative}
      </motion.p>
      <ul className="ai-summary__highlights">
        {highlights.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 + index * 0.06 }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
