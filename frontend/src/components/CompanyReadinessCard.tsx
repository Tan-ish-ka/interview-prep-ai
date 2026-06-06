import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import type { CompanyReadiness } from "../types/report";
import { GlassCard } from "./GlassCard";

interface CompanyReadinessCardProps {
  companies: CompanyReadiness[];
  delay?: number;
}

const LEVEL_CLASS: Record<string, string> = {
  Ready: "company-level--ready",
  "Nearly Ready": "company-level--nearly",
  Developing: "company-level--developing",
  "Early Stage": "company-level--early",
};

export function CompanyReadinessCard({
  companies,
  delay = 0.19,
}: CompanyReadinessCardProps) {
  const topCompanies = companies.slice(0, 10);

  return (
    <GlassCard className="section-card section-card--companies" delay={delay}>
      <div className="section-card__header">
        <Building2 size={22} />
        <div>
          <h2>Company Readiness</h2>
          <p className="section-card__desc">
            Track-specific fit scores — separate from skill and momentum
          </p>
        </div>
        {topCompanies.length > 0 ? (
          <span className="section-card__count">{topCompanies.length} tracks</span>
        ) : null}
      </div>

      {topCompanies.length === 0 ? (
        <p className="empty-chip">Not enough topic data to estimate company readiness yet.</p>
      ) : (
        <ul className="company-readiness-list">
          {topCompanies.map((item, index) => (
            <motion.li
              key={item.company}
              className="company-readiness-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + index * 0.04 }}
            >
              <div className="company-readiness-item__header">
                <div>
                  <p className="company-readiness-item__name">{item.company}</p>
                  <span
                    className={`company-level-badge ${
                      LEVEL_CLASS[item.level] ?? "company-level--developing"
                    }`}
                  >
                    {item.level}
                  </span>
                </div>
                <div className="company-readiness-item__score">
                  <span className="company-readiness-item__score-value">{item.score}</span>
                  <span className="company-readiness-item__score-label">fit</span>
                </div>
              </div>
              <p className="company-readiness-item__reason">{item.reason}</p>
              <div className="company-readiness-item__bar" aria-hidden>
                <motion.div
                  className="company-readiness-item__bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 0.7, delay: delay + index * 0.05 }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
