import { motion } from "framer-motion";
import { AlertTriangle, Info, Lightbulb, Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface RecommendationsProps {
  items: string[];
}

function priorityFor(index: number, total: number): "high" | "medium" | "low" {
  if (index === 0) return "high";
  if (index < Math.ceil(total / 2)) return "medium";
  return "low";
}

const priorityConfig = {
  high: { label: "Priority", icon: AlertTriangle, className: "rec-priority--high" },
  medium: { label: "Focus", icon: Lightbulb, className: "rec-priority--medium" },
  low: { label: "Tip", icon: Info, className: "rec-priority--low" },
};

export function Recommendations({ items }: RecommendationsProps) {
  return (
    <GlassCard className="section-card">
      <div className="section-card__header">
        <Sparkles size={22} />
        <div>
          <h2>Recommendations</h2>
          <p className="section-card__desc">Personalized next steps from your report</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="empty-chip">You&apos;re in great shape — no actions suggested right now.</p>
      ) : (
        <ul className="recommendation-list">
          {items.map((text, index) => {
            const priority = priorityFor(index, items.length);
            const { label, icon: Icon, className } = priorityConfig[priority];
            return (
              <motion.li
                key={`${index}-${text.slice(0, 20)}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <span className={`rec-priority ${className}`}>
                  <Icon size={12} />
                  {label}
                </span>
                <p>{text}</p>
              </motion.li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
