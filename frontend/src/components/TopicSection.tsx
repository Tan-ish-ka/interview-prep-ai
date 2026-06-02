import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TopicSectionProps {
  weakTopics: string[];
  strongTopics: string[];
}

export function TopicSection({ weakTopics, strongTopics }: TopicSectionProps) {
  return (
    <div className="topics-grid">
      <GlassCard className="section-card">
        <div className="section-card__header">
          <ShieldAlert size={22} />
          <div>
            <h2>Weak topics</h2>
            <p className="section-card__desc">Fewer than 5 solves — prioritize these</p>
          </div>
        </div>
        <div className="topic-list">
          {weakTopics.length === 0 ? (
            <span className="empty-chip">No weak topics — great coverage</span>
          ) : (
            weakTopics.map((tag, i) => (
              <motion.span
                key={tag}
                className="topic-pill topic-pill--weak"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))
          )}
        </div>
      </GlassCard>

      <GlassCard className="section-card" delay={0.06}>
        <div className="section-card__header">
          <ShieldCheck size={22} />
          <div>
            <h2>Strong topics</h2>
            <p className="section-card__desc">Top 3 by solved count</p>
          </div>
        </div>
        <div className="topic-list">
          {strongTopics.length === 0 ? (
            <span className="empty-chip">Build depth to unlock strengths</span>
          ) : (
            strongTopics.map((tag, i) => (
              <motion.span
                key={tag}
                className="topic-pill topic-pill--strong"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
