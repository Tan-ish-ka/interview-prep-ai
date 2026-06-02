import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <header className="hero">
      <div className="hero__badge">
        <Sparkles size={14} />
        Interview-ready insights
      </div>
      <h1 className="hero__title">
        <span className="gradient-text">Interview Prep AI</span>
      </h1>
      <p className="hero__subtitle">
        Turn any competitive programming profile into a clear prep report — ratings,
        contests, activity, topics, and personalized recommendations.
      </p>
    </header>
  );
}
