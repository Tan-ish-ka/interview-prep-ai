import { motion } from "framer-motion";
import type { CompanyReadiness } from "../types/report";

const LEVEL_CLASS: Record<string, string> = {
  "Interview Ready": "company-level--ready",
  "Nearly Ready": "company-level--nearly",
  Developing: "company-level--developing",
  "Early Stage": "company-level--early",
};

interface CompanyReadinessItemProps {
  item: CompanyReadiness;
  index?: number;
  delay?: number;
  compact?: boolean;
  onClick?: () => void;
}

export function CompanyReadinessItem({
  item,
  index = 0,
  delay = 0,
  compact = false,
  onClick,
}: CompanyReadinessItemProps) {
  const isClickable = !!onClick;
  
  return (
    <motion.li
      className={`company-readiness-item${compact ? " company-readiness-item--compact" : ""} ${isClickable ? "clickable" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.04 }}
      onClick={onClick}
      style={isClickable ? { cursor: 'pointer' } : {}}
      whileHover={isClickable ? { scale: 1.02 } : {}}
    >
      <div className="company-readiness-item__header">
        <div>
          <p className="company-readiness-item__name">{item.company}</p>
          <div className="company-readiness-item__meta">
            <span
              className={`company-level-badge ${
                LEVEL_CLASS[item.level] ?? "company-level--developing"
              }`}
            >
              {item.level}
            </span>
            {!compact ? (
              <span className="company-readiness-item__category">{item.category}</span>
            ) : null}
          </div>
        </div>
        <div className="company-readiness-item__score">
          <span className="company-readiness-item__score-value">{item.overall_readiness}</span>
          <span className="company-readiness-item__score-label">fit</span>
        </div>
      </div>

      <div className="company-readiness-item__bar" aria-hidden>
        <motion.div
          className="company-readiness-item__bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${item.overall_readiness}%` }}
          transition={{ duration: 0.7, delay: delay + index * 0.05 }}
        />
      </div>
    </motion.li>
  );
}
