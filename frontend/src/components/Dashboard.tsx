import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { staggerContainer, fadeUp } from "../lib/motion";
import type { ReportResponse } from "../types/report";
import { ActivityAnalytics } from "./ActivityAnalytics";
import { AiSummaryCard } from "./AiSummaryCard";
import { UnifiedProfileCard } from "./UnifiedProfileCard";
import { SkillMatrix } from "./SkillMatrix";
import { ActivityFeed } from "./ActivityFeed";
import { DebugInspector } from "./DebugInspector";
import { LeetCodeStatsCard } from "./LeetCodeStatsCard";
import { CodeChefStatsCard } from "./CodeChefStatsCard";
import { ContestAnalytics } from "./ContestAnalytics";
import { InsightHeader } from "./InsightHeader";
import { RatingAnalytics } from "./RatingAnalytics";
import { CompanyReadinessCard } from "./CompanyReadinessCard";
import { InterviewPreparationCard } from "./InterviewPreparationCard";
import { PotentialEfficiencyCard } from "./PotentialEfficiencyCard";
import { Recommendations } from "./Recommendations";
import { TopicSection } from "./TopicSection";
import { SectionTabs, DashboardTab } from "./SectionTabs";
import { GlassCard } from "./GlassCard";
import { InterviewCoachTab } from "./InterviewCoachTab";
import { FailureIntelligenceCard } from "./FailureIntelligenceCard";
import { LearningDNACard } from "./LearningDNACard";
import { HiddenPotentialCard } from "./HiddenPotentialCard";
import { ContestReplayTab } from "./ContestReplayTab";
import { SolutionIntelligenceTab } from "./SolutionIntelligenceTab";
import { SettingsTab } from "./SettingsTab";
import { Input } from "./Input";
import { fetchComparison, type ComparisonResponse } from "../api/report";
import { PlatformsManager } from "./PlatformsManager";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  Zap,
  Trophy,
  TrendingUp,
  Target,
  Brain,
  Sparkles,
  CheckCircle2,
  Loader2,
  Code2,
  TrophyIcon,
  Layers,
  BarChart3,
  Star,
  Activity,
} from "lucide-react";

interface DashboardProps {
  report: ReportResponse;
}

function OverviewTab({ report }: { report: ReportResponse }) {
  const { profile, insights, recommendations } = report;
  const isUnified = report.contributions && Object.keys(report.contributions).length > 1;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <InsightHeader profile={profile} insights={insights} />
      {isUnified && <UnifiedProfileCard report={report} delay={0.04} />}
      
      {profile.platform === "leetcode" && <LeetCodeStatsCard report={report} delay={0.06} />}
      {profile.platform === "codechef" && <CodeChefStatsCard report={report} delay={0.06} />}
      
      {(profile.platform === "codeforces" || profile.platform === "unified") && (
        <AiSummaryCard
          profile={profile}
          insights={insights}
          recommendationCount={recommendations.length}
          delay={0.06}
        />
      )}
      
      {isUnified && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <SkillMatrix report={report} delay={0.08} />
          <ActivityFeed report={report} delay={0.1} />
        </div>
      )}
    </motion.div>
  );
}

function AnalyticsTab({ report }: { report: ReportResponse }) {
  const { profile, insights } = report;
  const isCodeforces = profile.platform === "codeforces" || profile.platform === "unified";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {isCodeforces && (
        <>
          <HiddenPotentialCard data={report.hidden_potential} delay={0.04} />
          <LearningDNACard data={report.learning_dna} delay={0.06} />
          <FailureIntelligenceCard data={report.failure_intelligence} />
          <RatingAnalytics profile={profile} insights={insights} delay={0.1} />
          <div className="dashboard-grid dashboard-grid--two">
            <ContestAnalytics stats={insights.contest_stats} delay={0.1} />
            <ActivityAnalytics
              stats={insights.activity_stats}
              recentActivity={insights.recent_activity}
              delay={0.12}
            />
          </div>
        </>
      )}
      <TopicSection
        weakTopics={insights.weak_topics}
        strongTopics={insights.strong_topics}
        delay={0.14}
      />
    </motion.div>
  );
}

function InterviewPrepTab({ report }: { report: ReportResponse }) {
  const { insights, recommendations, interview_preparation } = report;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <InterviewPreparationCard preparation={interview_preparation} delay={0.06} />
      <PotentialEfficiencyCard data={insights.potential_efficiency} delay={0.1} />
      <Recommendations items={recommendations} delay={0.14} />
    </motion.div>
  );
}

function CompaniesTab({ report }: { report: ReportResponse }) {
  const companies = report.interview_preparation?.company_readiness || [];
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <CompanyReadinessCard
        companies={companies}
        report={report}
        delay={0.06}
      />
    </motion.div>
  );
}

function CompareTab({ currentHandle }: { currentHandle: string }) {
  const [otherHandle, setOtherHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);

  const handleCompare = async () => {
    if (!otherHandle.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComparison(currentHandle, otherHandle.trim());
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compare profiles");
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = () => {
    if (!comparison) return [];
    const maxCount = Math.max(
      ...comparison.topic_comparison.map((t) => Math.max(t.count_a, t.count_b)),
      1
    );
    const topics = ["Algorithms", "DP", "Graphs", "Greedy", "Math", "Data Structures"];
    return topics.map((topic) => {
      const found = comparison.topic_comparison.find((t) =>
        t.topic.toLowerCase().includes(topic.toLowerCase())
      );
      return {
        subject: topic,
       [currentHandle]: found
  ? (found.count_a / maxCount) * 100
  : 5,

[comparison.profile_b.username]: found
  ? (found.count_b / maxCount) * 100
  : 5,
      };
    });
  };

  const getMetricChartData = () => {
    if (!comparison) return [];
    return [
      { metric: "Skill Score", you: Number(comparison.metric_comparison.skill_score?.value_a) || 0, opp: Number(comparison.metric_comparison.skill_score?.value_b) || 0 },
      { metric: "Consistency", you: Number(comparison.metric_comparison.consistency_score?.value_a) || 0, opp: Number(comparison.metric_comparison.consistency_score?.value_b) || 0 },
      { metric: "Activity", you: Number(comparison.metric_comparison.activity_score?.value_a) || 0, opp: Number(comparison.metric_comparison.activity_score?.value_b) || 0 },
      { metric: "Readiness", you: Number(comparison.metric_comparison.interview_readiness?.value_a) || 0, opp: Number(comparison.metric_comparison.interview_readiness?.value_b) || 0 },
    ].filter(d => d.you > 0 || d.opp > 0);
  };

  const getTopicChartData = () => {
    if (!comparison) return [];
    return [...comparison.topic_comparison]
      .sort((a, b) => (b.count_a + b.count_b) - (a.count_a + a.count_b))
      .slice(0, 10)
      .reverse()
      .map(t => ({
        topic: t.topic.length > 16 ? t.topic.slice(0, 16) + "…" : t.topic,
        you: t.count_a,
        opp: t.count_b,
      }));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={fadeUp} className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">Head-to-Head</p>
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2">Compare Profiles</h1>
          <p className="text-base text-gray-400">Side-by-side competitive analytics with detailed insights</p>
        </div>
      </motion.div>

      {/* VS Hero Section */}
      <GlassCard delay={0.05} className="p-0 overflow-hidden" accent="cyan">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_1fr]">
          {/* You — Left */}
          <div className="p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-cyan-500/25 ring-1 ring-cyan-400/30">
                  {currentHandle[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-2xl font-black text-white">{currentHandle}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-semibold border border-cyan-400/25">You</span>
                  </div>
                  <p className="text-sm text-gray-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Codeforces
                  </p>
                </div>
              </div>

              {comparison ? (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Rating", value: comparison.metric_comparison.current_rating?.value_a, color: "text-white" },
                    { label: "Peak", value: comparison.metric_comparison.max_rating?.value_a, color: "text-yellow-400" },
                    { label: "Solved", value: comparison.metric_comparison.total_solved?.value_a, color: "text-emerald-400" },
                    { label: "Skill", value: comparison.metric_comparison.skill_score?.value_a, color: "text-cyan-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</p>
                      <p className={`text-xl font-black ${color}`}>{value ?? "—"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {["Rating", "Peak Rating", "Problems Solved", "Skill Score"].map((label) => (
                    <div key={label} className="h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VS Badge — Center */}
          <div className="flex flex-col items-center justify-center py-8 px-4 relative border-l border-r border-white/[0.06]"
            style={{ background: "linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.06) 100%)" }}>
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 32px rgba(99,102,241,0.4)", "0 0 0px rgba(99,102,241,0)"],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl ring-2 ring-white/10"
            >
              <span className="text-2xl font-black text-white tracking-tight">VS</span>
            </motion.div>
            <div className="mt-4 w-px flex-1 bg-gradient-to-b from-indigo-500/20 to-transparent" />
          </div>

          {/* Opponent — Right */}
          <div className="p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/6 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              {!comparison ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/25 flex items-center justify-center ring-1 ring-white/5">
                      <TrophyIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">Opponent</h3>
                      <p className="text-sm text-gray-500">Enter a Codeforces handle</p>
                    </div>
                  </div>
                  <Input
                    value={otherHandle}
                    onChange={(e) => setOtherHandle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                    placeholder="e.g., tourist, jiangly…"
                    className="mb-4"
                  />
                  <motion.button
                    onClick={handleCompare}
                    disabled={loading || !otherHandle.trim()}
                    className="w-full btn-primary flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 spin" /> Comparing…</>
                    ) : (
                      <><Sparkles className="w-5 h-5" /> Start Comparison</>
                    )}
                  </motion.button>
                  {error && (
                    <div className="mt-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-400/20 text-sm text-red-400">
                      {error}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-purple-500/25 ring-1 ring-purple-400/30">
                      {comparison.profile_b.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{comparison.profile_b.username}</h3>
                      <p className="text-sm text-gray-400 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" /> Codeforces
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Rating", value: comparison.metric_comparison.current_rating?.value_b, color: "text-white" },
                      { label: "Peak", value: comparison.metric_comparison.max_rating?.value_b, color: "text-yellow-400" },
                      { label: "Solved", value: comparison.metric_comparison.total_solved?.value_b, color: "text-emerald-400" },
                      { label: "Skill", value: comparison.metric_comparison.skill_score?.value_b, color: "text-purple-400" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</p>
                        <p className={`text-xl font-black ${color}`}>{value ?? "—"}</p>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    onClick={() => { setComparison(null); setOtherHandle(""); }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.07] text-sm font-semibold transition-all"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Compare Another
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Results */}
      <AnimatePresence mode="wait">
        {comparison && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Metric Overview Cards */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Key Metrics</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: "skill_score", label: "Skill Score", icon: Brain, colorA: "text-cyan-400", colorB: "text-purple-400", barA: "from-cyan-500 to-cyan-400", barB: "from-purple-500 to-purple-400" },
                  { key: "consistency_score", label: "Consistency", icon: CheckCircle2, colorA: "text-cyan-400", colorB: "text-purple-400", barA: "from-cyan-500 to-cyan-400", barB: "from-purple-500 to-purple-400" },
                  { key: "activity_score", label: "Activity", icon: Activity, colorA: "text-cyan-400", colorB: "text-purple-400", barA: "from-cyan-500 to-cyan-400", barB: "from-purple-500 to-purple-400" },
                  { key: "interview_readiness", label: "Readiness", icon: Target, colorA: "text-cyan-400", colorB: "text-purple-400", barA: "from-cyan-500 to-cyan-400", barB: "from-purple-500 to-purple-400" },
                ].map(({ key, label, icon: Icon, colorA, colorB, barA, barB }, idx) => {
                  const metricData = comparison.metric_comparison[key];
                  if (!metricData) return null;
                  const isCurrentWinner = metricData.winner === "profile_a";
                  const isOpponentWinner = metricData.winner === "profile_b";
                  const maxScore = Math.max(Number(metricData.value_a || 0), Number(metricData.value_b || 0), 1);
                  const pctA = (Number(metricData.value_a || 0) / maxScore) * 100;
                  const pctB = (Number(metricData.value_b || 0) / maxScore) * 100;
                  return (
                    <GlassCard key={key} delay={0.08 + idx * 0.04} className="p-6 group" accent="cyan">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-white/5 border border-white/8 group-hover:border-cyan-400/20 transition-colors">
                            <Icon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                        </div>
                        {(isCurrentWinner || isOpponentWinner) && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${isCurrentWinner ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/25" : "bg-purple-500/10 text-purple-400 border-purple-400/25"}`}>
                            {isCurrentWinner ? "You win" : "They win"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className={`text-3xl font-black leading-none ${isCurrentWinner ? colorA : "text-gray-500"}`}>
                            {metricData.value_a ?? "—"}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1 font-medium">You</p>
                        </div>
                        <div className="w-px h-8 bg-white/8" />
                        <div className="text-right">
                          <p className={`text-3xl font-black leading-none ${isOpponentWinner ? colorB : "text-gray-500"}`}>
                            {metricData.value_b ?? "—"}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1 font-medium">Opponent</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-600 w-4">You</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctA}%` }}
                              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full bg-gradient-to-r ${barA} rounded-full`}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-600 w-4">Opp</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pctB}%` }}
                              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                              className={`h-full bg-gradient-to-r ${barB} rounded-full`}
                            />
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>

            {/* Head-to-Head Metrics Bar Chart */}
            <GlassCard delay={0.12} className="p-8" accent="cyan">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Head-to-Head Performance</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Score comparison across all key metrics</p>
                </div>
              </div>
              {getMetricChartData().length > 0 ? (
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={getMetricChartData()} margin={{ top: 0, right: 30, left: 90, bottom: 0 }}>
                      <defs>
                        <linearGradient id="youGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="oppGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#a855f7" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                      <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "10px 14px", fontSize: "13px" }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px", fontSize: "12px", fontWeight: 600 }} />
                      <Bar dataKey="you" name={currentHandle} fill="url(#youGrad)" radius={[0, 6, 6, 0]} barSize={14} />
                      <Bar dataKey="opp" name={comparison.profile_b.username} fill="url(#oppGrad)" radius={[0, 6, 6, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">No score data available</p>
              )}
            </GlassCard>

            {/* Radar Chart + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard delay={0.15} className="lg:col-span-2 p-8" accent="purple">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/20">
                      <Layers className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Topic Strength Map</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Normalized across all solved problems</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /><span className="text-gray-400">{currentHandle}</span></span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /><span className="text-gray-400">{comparison.profile_b.username}</span></span>
                  </div>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getRadarData()}>
                      <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name={currentHandle} dataKey={currentHandle} stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.18} strokeWidth={2} />
                      <Radar name={comparison.profile_b.username} dataKey={comparison.profile_b.username} stroke="#a855f7" fill="#a855f7" fillOpacity={0.18} strokeWidth={2} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "14px", padding: "10px 14px", fontSize: "12px" }}
                        labelStyle={{ color: "#94a3b8", fontWeight: 700, marginBottom: 4 }}
                      />
                      <Legend wrapperStyle={{ display: "none" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              <GlassCard delay={0.18} className="p-8 flex flex-col gap-5" accent="purple">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-400/20">
                    <Brain className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-black text-white">Verdict</h3>
                </div>

                {/* Winner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/8 border border-yellow-400/20 ring-1 ring-yellow-400/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">Overall Winner</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    {comparison.head_to_head.skill === "profile_a" ? currentHandle : comparison.profile_b.username}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{comparison.head_to_head.summary.substring(0, 80)}…</p>
                </div>

                {/* Strengths */}
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Your Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comparison.topic_summary.stronger_for_a.slice(0, 5).map((topic, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-400/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gaps */}
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Gaps to Close</p>
                  <div className="flex flex-wrap gap-1.5">
                    {comparison.topic_summary.missing_in_a.slice(0, 5).map((topic, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-400/20">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mutual weaknesses */}
                {comparison.topic_summary.mutual_weaknesses.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Both Weak At</p>
                    <div className="flex flex-wrap gap-1.5">
                      {comparison.topic_summary.mutual_weaknesses.slice(0, 4).map((topic, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 text-xs font-semibold border border-orange-400/20">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Detailed Breakdown — cards instead of table */}
            <GlassCard delay={0.22} className="p-8" accent="cyan">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Detailed Breakdown</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Full metric-by-metric comparison</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: "current_rating", label: "Current Rating", icon: Star },
                  { key: "max_rating", label: "Peak Rating", icon: TrendingUp },
                  { key: "total_solved", label: "Problems Solved", icon: CheckCircle2 },
                  { key: "consistency_score", label: "Consistency Score", icon: Activity },
                  { key: "activity_score", label: "Activity Score", icon: Zap },
                  { key: "interview_readiness", label: "Interview Readiness", icon: Target },
                ].map(({ key, label, icon: Icon }) => {
                  const metricData = comparison.metric_comparison[key];
                  if (!metricData) return null;
                  const isCurrentWinner = metricData.winner === "profile_a";
                  const isOpponentWinner = metricData.winner === "profile_b";
                  return (
                    <div key={key} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group">
                      <div className="flex items-center gap-2 mb-4">
                        <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-3 rounded-xl text-center border transition-colors ${isCurrentWinner ? "bg-cyan-500/10 border-cyan-400/25" : "bg-white/[0.02] border-white/5"}`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {isCurrentWinner && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                            <span className="text-[10px] font-bold text-gray-500 uppercase">You</span>
                          </div>
                          <span className={`text-lg font-black ${isCurrentWinner ? "text-cyan-400" : "text-gray-400"}`}>
                            {metricData.value_a ?? "—"}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl text-center border transition-colors ${isOpponentWinner ? "bg-purple-500/10 border-purple-400/25" : "bg-white/[0.02] border-white/5"}`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {isOpponentWinner && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Opp</span>
                          </div>
                          <span className={`text-lg font-black ${isOpponentWinner ? "text-purple-400" : "text-gray-400"}`}>
                            {metricData.value_b ?? "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Topic Face-Off Chart */}
            {getTopicChartData().length > 0 && (
              <GlassCard delay={0.24} className="p-8" accent="purple">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/20">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Topic Face-Off</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Top topics solved — you vs opponent (top 10)</p>
                  </div>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={getTopicChartData()} margin={{ top: 0, right: 30, left: 110, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="topic" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                      <RechartsTooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "10px 14px", fontSize: "13px" }} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px", fontSize: "12px", fontWeight: 600 }} />
                      <Bar dataKey="you" name={currentHandle} fill="url(#youGrad)" radius={[0, 6, 6, 0]} barSize={10} />
                      <Bar dataKey="opp" name={comparison.profile_b.username} fill="url(#oppGrad)" radius={[0, 6, 6, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {/* Topic Analysis — Strong / Improve / Recs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <GlassCard delay={0.25} className="p-7" accent="green">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                    <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-black text-white">Your Strong Topics</h4>
                </div>
                <div className="space-y-2.5">
                  {comparison.topic_summary.stronger_for_a.slice(0, 5).map((topic, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-400/10 hover:border-emerald-400/25 hover:bg-emerald-500/10 transition-all">
                      <span className="text-gray-200 text-sm font-semibold">{topic}</span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Strong</span>
                    </div>
                  ))}
                  {comparison.topic_summary.stronger_for_a.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No dominant topics yet</p>
                  )}
                </div>
              </GlassCard>

              <GlassCard delay={0.28} className="p-7" accent="orange">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-400/20">
                    <Target className="w-4.5 h-4.5 text-orange-400" />
                  </div>
                  <h4 className="text-base font-black text-white">Areas to Improve</h4>
                </div>
                <div className="space-y-2.5">
                  {comparison.topic_summary.missing_in_a.slice(0, 5).map((topic, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-xl bg-orange-500/5 border border-orange-400/10 hover:border-orange-400/25 hover:bg-orange-500/10 transition-all">
                      <span className="text-gray-200 text-sm font-semibold">{topic}</span>
                      <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">Gap</span>
                    </div>
                  ))}
                  {comparison.topic_summary.missing_in_a.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No critical gaps found</p>
                  )}
                </div>
              </GlassCard>

              <GlassCard delay={0.31} className="p-7" accent="purple">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
                    <Brain className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <h4 className="text-base font-black text-white">Next Steps</h4>
                </div>
                <div className="space-y-3">
                  {(comparison.improvement_insights?.improvement_areas ?? [
                    { name: "Focus on DP fundamentals", reason: "Builds problem-solving depth" },
                    { name: "Graph traversal problems", reason: "Critical for FAANG interviews" },
                    { name: "Greedy algorithm practice", reason: "Common contest pattern" },
                  ]).slice(0, 4).map((rec: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-400/10 hover:border-indigo-400/25 hover:bg-indigo-500/10 transition-all">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-gray-200 text-sm font-semibold">{rec.name ?? rec}</p>
                        {rec.reason && <p className="text-gray-500 text-xs mt-0.5">{rec.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Dashboard({ report }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab report={report} />;
      case "analytics":
        return <AnalyticsTab report={report} />;
      case "interview-prep":
        return <InterviewPrepTab report={report} />;
      case "companies":
        return <CompaniesTab report={report} />;
      case "compare":
        return <CompareTab currentHandle={report.profile.username} />;
      case "platforms":
        return <PlatformsManager />;
      case "coach":
        return <InterviewCoachTab report={report} />;
      case "replay":
        return <ContestReplayTab report={report} />;
      case "solution":
        return <SolutionIntelligenceTab report={report} />;
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <SectionTabs active={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      <DebugInspector report={report} />
    </div>
  );
}
