import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { ContestAnalytics } from "./ContestAnalytics";
import { ProfileSummary } from "./ProfileSummary";
import { RatingAnalytics } from "./RatingAnalytics";
import { Recommendations } from "./Recommendations";
import { TopicSection } from "./TopicSection";

interface DashboardProps {
  report: ReportResponse;
}

export function Dashboard({ report }: DashboardProps) {
  const { profile, insights, recommendations } = report;

  return (
    <div className="dashboard">
      <ProfileSummary profile={profile} totalSolved={insights.total_solved} />
      <RatingAnalytics insights={insights} />
      <div className="dashboard-grid dashboard-grid--two">
        <ContestAnalytics stats={insights.contest_stats} />
        <ActivityAnalytics stats={insights.activity_stats} recentActivity={insights.recent_activity} />
      </div>
      <TopicSection weakTopics={insights.weak_topics} strongTopics={insights.strong_topics} />
      <Recommendations items={recommendations} />
    </div>
  );
}
