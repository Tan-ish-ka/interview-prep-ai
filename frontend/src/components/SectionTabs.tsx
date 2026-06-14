import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Building2,
  Users,
  Globe,
} from "lucide-react";

export type DashboardTab =
  | "overview"
  | "analytics"
  | "interview-prep"
  | "companies"
  | "compare"
  | "platforms";

interface SectionTabsProps {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const TABS: {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    id: "interview-prep",
    label: "Interview Prep",
    icon: Brain,
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
  },
  {
    id: "compare",
    label: "Compare",
    icon: Users,
  },
  {
    id: "platforms",
    label: "Platforms",
    icon: Globe,
  },
];

export function SectionTabs({
  active,
  onChange,
}: SectionTabsProps) {
  return (
    <div className="section-tabs" role="tablist">
      {TABS.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`section-tabs__btn ${
              active === tab.id
                ? "section-tabs__btn--active"
                : ""
            }`}
            onClick={() => onChange(tab.id)}
          >
            {active === tab.id ? (
              <motion.span
                layoutId="tab-pill"
                className="section-tabs__indicator"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
              />
            ) : null}

            <span className="section-tabs__label">
              <Icon size={14} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}