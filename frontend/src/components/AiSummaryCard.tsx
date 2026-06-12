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
    <GlassCard className="ai-summary" delay={delay} hover={false} accent="purple">
      <div className="ai-summary__glow" aria-hidden />
      <div className="ai-summary__header">
        <motion.div
          className="ai-summary__icon"
          whileHover={{ scale: 1.08, y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Bot size={24} />
        </motion.div>
        <div>
          <motion.p
            className="ai-summary__eyebrow"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.1 }}
          >
            <Sparkles size={13} />
            AI Executive Summary
          </motion.p>
          <motion.h2
            className="ai-summary__headline"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.15 }}
          >
            {headline}
          </motion.h2>
        </div>
      </div>
      <motion.p
        className="ai-summary__narrative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {narrative}
      </motion.p>
      <ul className="ai-summary__highlights">
        {highlights.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.25 + index * 0.08 }}
            whileHover={{ x: 4, backgroundColor: "rgba(168, 85, 247, 0.15)" }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
