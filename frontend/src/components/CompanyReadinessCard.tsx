import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ChevronRight } from "lucide-react";
import type { CompanyReadiness } from "../types/report";
import { CompanyBrowserModal } from "./CompanyBrowserModal";
import { CompanyReadinessItem } from "./CompanyReadinessItem";
import { GlassCard } from "./GlassCard";

interface CompanyReadinessCardProps {
  companies: CompanyReadiness[];
  delay?: number;
}

const DASHBOARD_PREVIEW_COUNT = 5;

export function CompanyReadinessCard({
  companies,
  delay = 0.19,
}: CompanyReadinessCardProps) {
  const [browserOpen, setBrowserOpen] = useState(false);
  const topCompanies = companies.slice(0, DASHBOARD_PREVIEW_COUNT);

  return (
    <>
      <GlassCard className="section-card section-card--companies" delay={delay} accent="cyan">
        <div className="section-card__header">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Building2 size={24} />
          </motion.div>
          <div className="flex-1">
            <h2 className="section-card__title">Company Readiness</h2>
            <p className="section-card__desc">
              Top recommended tracks — separate from skill and momentum scores
            </p>
          </div>
          {companies.length > 0 ? (
            <motion.span
              className="section-card__count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.1, type: "spring", stiffness: 400 }}
            >
              {companies.length}
            </motion.span>
          ) : null}
        </div>

        {topCompanies.length === 0 ? (
          <motion.p
            className="empty-chip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
          >
            Not enough topic data to estimate company readiness yet.
          </motion.p>
        ) : (
          <ul className="company-readiness-list company-readiness-list--dashboard">
            {topCompanies.map((item, index) => (
              <CompanyReadinessItem
                key={item.company}
                item={item}
                index={index}
                delay={delay}
              />
            ))}
          </ul>
        )}

        {companies.length > DASHBOARD_PREVIEW_COUNT ? (
          <motion.button
            type="button"
            className="company-browser-trigger"
            onClick={() => setBrowserOpen(true)}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            View All Companies
            <ChevronRight size={18} />
          </motion.button>
        ) : null}
      </GlassCard>

      <CompanyBrowserModal
        companies={companies}
        isOpen={browserOpen}
        onClose={() => setBrowserOpen(false)}
      />
    </>
  );
}
