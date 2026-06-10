import { motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer } from "../lib/motion";
import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { AiSummaryCard } from "./AiSummaryCard";
import { ContestAnalytics } from "./ContestAnalytics";
import { InsightHeader } from "./InsightHeader";
import { RatingAnalytics } from "./RatingAnalytics";
import { CompanyReadinessCard } from "./CompanyReadinessCard";
import { InterviewPreparationCard } from "./InterviewPreparationCard";
import { PotentialEfficiencyCard } from "./PotentialEfficiencyCard";
import { Recommendations } from "./Recommendations";
import { TopicSection } from "./TopicSection";
import { CompareTab } from "./CompareTab";
import { SectionTabs } from "./SectionTabs";
import type { DashboardTab } from "./SectionTabs";

interface DashboardProps {
  report: ReportResponse;
  opponentReport?: ReportResponse;
}

export function Dashboard({ report, opponentReport }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const { profile, insights, recommendations, interview_preparation } = report;

  return (
    <motion.div
      className="dashboard"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <InsightHeader profile={profile} insights={insights} />

      {/* Tab Navigation */}
      <SectionTabs active={activeTab} onChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <motion.div
          className="dashboard-tab-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AiSummaryCard
            profile={profile}
            insights={insights}
            recommendationCount={recommendations.length}
            delay={0.06}
          />
          <RatingAnalytics profile={profile} insights={insights} delay={0.1} />
          <div className="dashboard-grid dashboard-grid--two">
            <ContestAnalytics stats={insights.contest_stats} delay={0.14} />
            <ActivityAnalytics
              stats={insights.activity_stats}
              recentActivity={insights.recent_activity}
              delay={0.16}
            />
          </div>
          <PotentialEfficiencyCard data={insights.potential_efficiency} delay={0.17} />
          <TopicSection
            weakTopics={insights.weak_topics}
            strongTopics={insights.strong_topics}
          />
          <InterviewPreparationCard preparation={interview_preparation} delay={0.18} />
          <CompanyReadinessCard
            companies={interview_preparation.company_readiness}
            delay={0.19}
          />
          <Recommendations items={recommendations} delay={0.2} />
        </motion.div>
      )}

      {/* Compare Tab */}
      {activeTab === "topics" && (
        <motion.div
          className="dashboard-tab-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CompareTab currentReport={report} opponentReport={opponentReport} />
        </motion.div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <motion.div
          className="dashboard-tab-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Recommendations items={recommendations} delay={0.06} />
        </motion.div>
      )}
    </motion.div>
  );
}
