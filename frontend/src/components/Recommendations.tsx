import { motion } from "framer-motion";
import { ListChecks, Sparkles } from "lucide-react";
import { fallbackPriority, inferRecommendationPriority } from "../lib/recommendationPriority";
import { GlassCard } from "./GlassCard";

interface RecommendationsProps {
  items: string[];
  delay?: number;
}

export function Recommendations({ items, delay = 0 }: RecommendationsProps) {
  return (
    <GlassCard className="section-card section-card--recs" delay={delay}>
      <div className="section-card__header">
        <ListChecks size={22} />
        <div>
          <h2>Recommendations</h2>
          <p className="section-card__desc">Prioritized actions from your latest report</p>
        </div>
        {items.length > 0 ? (
          <span className="section-card__count">{items.length} items</span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="empty-chip">You&apos;re in great shape — no actions suggested right now.</p>
      ) : (
        <ul className="recommendation-grid">
          {items.map((text, index) => {
            const inferred = inferRecommendationPriority(text);
            const meta =
              inferred.priority !== "low" || index < 2
                ? inferred
                : fallbackPriority(index, items.length);
            const Icon = meta.icon;

            return (
              <motion.li
                key={`${index}-${text.slice(0, 24)}`}
                className={`rec-card ${meta.className}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + index * 0.05, duration: 0.35 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <div className="rec-card__top">
                  <span className={`rec-card__badge rec-card__badge--${meta.priority}`}>
                    <Icon size={14} strokeWidth={2.25} />
                    {meta.label}
                  </span>
                  <span className="rec-card__index">#{index + 1}</span>
                </div>
                <p className="rec-card__text">{text}</p>
                <div className="rec-card__accent" aria-hidden>
                  <Sparkles size={12} />
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
