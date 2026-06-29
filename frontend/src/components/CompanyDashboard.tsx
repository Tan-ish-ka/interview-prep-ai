import { motion } from "framer-motion";
import { ArrowLeft, Target, TrendingUp, HelpCircle, Code2, AlertTriangle, MessageSquare } from "lucide-react";
import type { CompanyReadiness, ReportResponse } from "../types/report";
import { API_BASE } from "../api/config";
import { useState } from "react";
import { CompanyCoachChat } from "./CompanyCoachChat";

interface CompanyDashboardProps {
  company: CompanyReadiness;
  report: ReportResponse;
  onClose: () => void;
}

export function CompanyDashboard({ company, report, onClose }: CompanyDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "coach">("overview");

  return (
    <div className="company-dashboard-overlay" role="dialog" aria-modal="true">
      <div className="company-dashboard">
        <header className="company-dashboard__header">
          <button className="company-dashboard__back" onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="company-dashboard__title">{company.company}</h1>
            <p className="company-dashboard__subtitle">{company.category} · {company.level}</p>
          </div>
          <div className="company-dashboard__score-badge">
            <span className="score-value">{company.overall_readiness}</span>
            <span className="score-label">Fit</span>
          </div>
        </header>

        <nav className="company-dashboard__nav">
          <button 
            className={`nav-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <TrendingUp size={16} /> Overview & Gaps
          </button>
          <button 
            className={`nav-btn ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            <Code2 size={16} /> Previous Questions
          </button>
          <button 
            className={`nav-btn ${activeTab === "coach" ? "active" : ""}`}
            onClick={() => setActiveTab("coach")}
          >
            <MessageSquare size={16} /> Ask AI Coach
          </button>
        </nav>

        <div className="company-dashboard__content">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-grid">
              
              <div className="glass-card section-card">
                <h3 className="section-card__title"><Target size={18} /> Topic Coverage Radar</h3>
                <div className="topic-radar-list">
                  {Object.entries(company.topic_radar).map(([topic, coverage]) => (
                    <div key={topic} className="radar-item">
                      <div className="radar-item__header">
                        <span className="radar-item__label">{topic}</span>
                        <span className="radar-item__value">{coverage}%</span>
                      </div>
                      <div className="radar-item__bar">
                        <div className="radar-item__fill" style={{ width: `${coverage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card section-card">
                <h3 className="section-card__title"><HelpCircle size={18} /> Expected Difficulty</h3>
                <div className="difficulty-distribution">
                  {Object.entries(company.difficulty_distribution).map(([diff, pct]) => (
                    <div key={diff} className={`diff-item diff-item--${diff.toLowerCase()}`}>
                      <span className="diff-item__label">{diff}</span>
                      <span className="diff-item__pct">{Math.round(pct * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card section-card dashboard-grid--full">
                <h3 className="section-card__title"><AlertTriangle size={18} /> Gap Analysis</h3>
                {company.gap_analysis.length === 0 ? (
                  <p className="empty-chip">You have 100% coverage for this company's core topics!</p>
                ) : (
                  <ul className="gap-analysis-list">
                    {company.gap_analysis.map((gap, idx) => (
                      <li key={idx} className="gap-analysis-item">
                        <div className="gap-header">
                          <h4>{gap.topic}</h4>
                          <span className="gap-stats">Current: {gap.current_coverage}% / Target: {gap.target_coverage}%</span>
                        </div>
                        <p className="gap-rec">{gap.recommendation}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </motion.div>
          )}

          {activeTab === "questions" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass-card section-card">
                <h3 className="section-card__title">Most Frequently Asked Problems</h3>
                <p className="section-card__desc">These are representative problems known to be asked in {company.company} interviews.</p>
                <div className="previous-questions-list">
                  {company.previous_questions.map((q, idx) => (
                    <div key={idx} className="previous-question-card">
                      <div className="q-header">
                        <h4>{q.title}</h4>
                        <span className={`diff-badge diff-badge--${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      </div>
                      <div className="q-meta">
                        <span className="q-platform">{q.platform}</span>
                        <span className="q-freq">{q.frequency} Frequency</span>
                        <span className="q-year">({q.year})</span>
                      </div>
                      <div className="q-tags">
                        {q.tags.map(t => <span key={t} className="q-tag">{t}</span>)}
                      </div>
                      <button className="practice-similar-btn" onClick={() => window.open(`${API_BASE}/problems/similar?tags=${q.tags.join(",")}&difficulty=${q.difficulty}`, "_blank")}>
                        Find Similar Problems (JSON)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "coach" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="coach-tab-container">
              <CompanyCoachChat company={company.company} report={report} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
