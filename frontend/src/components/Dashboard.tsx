import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer } from "../lib/motion";
import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { ContestAnalytics } from "./ContestAnalytics";
import { InsightHeader } from "./InsightHeader";
import { RatingAnalytics } from "./RatingAnalytics";
import { Recommendations } from "./Recommendations";
import { SectionTabs, type DashboardTab } from "./SectionTabs";
import { TopicSection } from "./TopicSection";

interface DashboardProps {
  report: ReportResponse;
}

export function Dashboard({ report }: DashboardProps) {
  const [tab, setTab] = useState<DashboardTab>("overview");
  const { profile, insights, recommendations } = report;

  return (
    <motion.div
      className="dashboard"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <InsightHeader profile={profile} insights={insights} />

      <SectionTabs active={tab} onChange={setTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="dashboard-tab-panel"
        >
          {tab === "overview" ? (
            <>
              <RatingAnalytics profile={profile} insights={insights} delay={0.05} />
              <div className="dashboard-grid dashboard-grid--two">
                <ContestAnalytics stats={insights.contest_stats} delay={0.1} />
                <ActivityAnalytics
                  stats={insights.activity_stats}
                  recentActivity={insights.recent_activity}
                  delay={0.12}
                />
              </div>
            </>
          ) : null}

          {tab === "topics" ? (
            <TopicSection
              weakTopics={insights.weak_topics}
              strongTopics={insights.strong_topics}
            />
          ) : null}

          {tab === "recommendations" ? (
            <Recommendations items={recommendations} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
