import { useState } from "react";
import { fetchReport } from "./api/report";
import type { ReportResponse } from "./types/report";
import { Dashboard } from "./components/Dashboard";
import { ErrorState } from "./components/ErrorState";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { LoadingState } from "./components/LoadingState";
import { UrlForm } from "./components/UrlForm";
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

  return (
    <div className="app-shell">
      <Hero />
      <UrlForm url={url} loading={loading} onUrlChange={setUrl} onSubmit={handleGenerate} />
      {loading ? <LoadingState /> : null}
      {error && !loading ? <ErrorState message={error} /> : null}
      {report && !loading ? <Dashboard report={report} /> : null}
      <Footer />
    </div>
  );
}
