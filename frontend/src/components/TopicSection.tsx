import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface TopicSectionProps {
  weakTopics: string[];
  strongTopics: string[];
}

function TopicPills({
  topics,
  variant,
}: {
  topics: string[];
  variant: "weak" | "strong";
}) {
  if (topics.length === 0) {
    return (
      <span className="empty-chip">
        {variant === "weak" ? "No weak topics — great coverage" : "Build depth to unlock strengths"}
      </span>
    );
  }

  return (
    <div className="topic-list">
      {topics.map((tag, index) => (
        <motion.span
          key={tag}
          className={`topic-pill topic-pill--${variant}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 24 }}
          whileHover={{ y: -2, scale: 1.03 }}
        >
          {variant === "strong" ? (
            <span className="topic-pill__rank">{index + 1}</span>
          ) : null}
          <span className="topic-pill__label">{tag}</span>
        </motion.span>
      ))}
    </div>
  );
}

export function TopicSection({ weakTopics, strongTopics }: TopicSectionProps) {
  return (
    <div className="topics-grid">
      <GlassCard className="section-card section-card--topics" delay={0.18}>
        <div className="section-card__header">
          <ShieldAlert size={22} />
          <div>
            <h2>Weak topics</h2>
            <p className="section-card__desc">Fewer than 5 solves — prioritize these</p>
          </div>
          <span className="topic-count topic-count--weak">{weakTopics.length}</span>
        </div>
        <TopicPills topics={weakTopics} variant="weak" />
      </GlassCard>

      <GlassCard className="section-card section-card--topics" delay={0.2}>
        <div className="section-card__header">
          <ShieldCheck size={22} />
          <div>
            <h2>Strong topics</h2>
            <p className="section-card__desc">Top 3 by solved count</p>
          </div>
          <span className="topic-count topic-count--strong">{strongTopics.length}</span>
        </div>
        <TopicPills topics={strongTopics} variant="strong" />
      </GlassCard>
    </div>
  );
}
