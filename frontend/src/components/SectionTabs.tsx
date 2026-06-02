import { motion } from "framer-motion";

export type DashboardTab = "overview" | "topics" | "recommendations";

interface SectionTabsProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "topics", label: "Topics" },
  { id: "recommendations", label: "Recommendations" },
];

export function SectionTabs({ active, onChange }: SectionTabsProps) {
  return (
    <div className="section-tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`section-tabs__btn ${active === tab.id ? "section-tabs__btn--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {active === tab.id ? (
            <motion.span
              layoutId="tab-pill"
              className="section-tabs__indicator"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ) : null}
          <span className="section-tabs__label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
