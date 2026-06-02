import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { fetchReport } from "./api/report";
import type { ReportResponse } from "./types/report";
import { Background } from "./components/Background";
import { CommandBar } from "./components/CommandBar";
import { Dashboard } from "./components/Dashboard";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LoadingState } from "./components/LoadingState";
import { SkeletonDashboard } from "./components/SkeletonDashboard";
import "./App.css";

export default function App() {
  const [url, setUrl] = useState("https://codeforces.com/profile/tourist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const data = await fetchReport(url);
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const showEmpty = !loading && !error && !report;

  return (
    <>
      <Background />
      <div className="app-layout">
        <div className="app-shell">
          <Hero />

          <div className="sticky-command">
            <CommandBar
              url={url}
              loading={loading}
              onUrlChange={setUrl}
              onSubmit={handleGenerate}
            />
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? <LoadingState key="loading" /> : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {loading ? <SkeletonDashboard key="skeleton" /> : null}
          </AnimatePresence>

          {error && !loading ? <ErrorState message={error} /> : null}

          <AnimatePresence mode="wait">
            {report && !loading ? (
              <Dashboard key="dashboard" report={report} />
            ) : showEmpty ? (
              <EmptyState key="empty" />
            ) : null}
          </AnimatePresence>

          <Footer />
        </div>
      </div>
    </>
  );
}
