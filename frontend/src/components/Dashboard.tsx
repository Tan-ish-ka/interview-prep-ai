import { motion } from "framer-motion";
import { staggerContainer } from "../lib/motion";
import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { AiSummaryCard } from "./AiSummaryCard";
import { ContestAnalytics } from "./ContestAnalytics";
import { InsightHeader } from "./InsightHeader";
import { RatingAnalytics } from "./RatingAnalytics";
import { Recommendations } from "./Recommendations";
import { TopicSection } from "./TopicSection";

interface DashboardProps {
  report: ReportResponse;
}

export function Dashboard({ report }: DashboardProps) {
  const { profile, insights, recommendations } = report;

  return (
    <motion.div
      className="dashboard"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <InsightHeader profile={profile} insights={insights} />
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
      <TopicSection
        weakTopics={insights.weak_topics}
        strongTopics={insights.strong_topics}
      />
      <Recommendations items={recommendations} delay={0.2} />
    </motion.div>
  );
}
