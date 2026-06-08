import { motion } from "framer-motion";
import type { CompanyReadiness } from "../types/report";

const LEVEL_CLASS: Record<string, string> = {
  Ready: "company-level--ready",
  "Nearly Ready": "company-level--nearly",
  Developing: "company-level--developing",
  "Early Stage": "company-level--early",
};

interface CompanyReadinessItemProps {
  item: CompanyReadiness;
  index?: number;
  delay?: number;
  compact?: boolean;
}

export function CompanyReadinessItem({
  item,
  index = 0,
  delay = 0,
  compact = false,
}: CompanyReadinessItemProps) {
  return (
    <motion.li
      className={`company-readiness-item${compact ? " company-readiness-item--compact" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.04 }}
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
          <span className="company-readiness-item__score-value">{item.score}</span>
          <span className="company-readiness-item__score-label">fit</span>
        </div>
      </div>

      {(item.strong_topics.length > 0 || item.missing_topics.length > 0) && (
        <div className="company-readiness-item__topics">
          {item.strong_topics.length > 0 ? (
            <div className="company-topic-group">
              <span className="company-topic-group__label">Strong</span>
              <ul className="company-topic-group__list">
                {item.strong_topics.map((topic) => (
                  <li key={`${item.company}-strong-${topic}`}>{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {item.missing_topics.length > 0 ? (
            <div className="company-topic-group company-topic-group--missing">
              <span className="company-topic-group__label">Missing</span>
              <ul className="company-topic-group__list">
                {item.missing_topics.map((topic) => (
                  <li key={`${item.company}-missing-${topic}`}>{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {!compact ? <p className="company-readiness-item__reason">{item.reason}</p> : null}

      <div className="company-readiness-item__bar" aria-hidden>
        <motion.div
          className="company-readiness-item__bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${item.score}%` }}
          transition={{ duration: 0.7, delay: delay + index * 0.05 }}
        />
      </div>
    </motion.li>
  );
}
