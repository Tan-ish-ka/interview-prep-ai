import { useState } from "react";
import { Building2 } from "lucide-react";
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
      <GlassCard className="section-card section-card--companies" delay={delay}>
        <div className="section-card__header">
          <Building2 size={22} />
          <div>
            <h2>Company Readiness</h2>
            <p className="section-card__desc">
              Top recommended tracks — separate from skill and momentum scores
            </p>
          </div>
          {companies.length > 0 ? (
            <span className="section-card__count">{companies.length} tracks</span>
          ) : null}
        </div>

        {topCompanies.length === 0 ? (
          <p className="empty-chip">Not enough topic data to estimate company readiness yet.</p>
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
          <button
            type="button"
            className="company-browser-trigger"
            onClick={() => setBrowserOpen(true)}
          >
            View All Companies
          </button>
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
