import { motion } from "framer-motion";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`skeleton-bone ${className}`} />;
}

export function SkeletonDashboard() {
  return (
    <motion.div
      className="skeleton-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden
    >
      <div className="glass-card skeleton-panel">
        <Bone className="skeleton-bone--title" />
        <div className="skeleton-grid skeleton-grid--profile">
          <Bone className="skeleton-bone--stat skeleton-bone--tall" />
          <Bone className="skeleton-bone--stat skeleton-bone--tall" />
          <Bone className="skeleton-bone--stat skeleton-bone--tall" />
          <Bone className="skeleton-bone--stat skeleton-bone--tall" />
        </div>
      </div>

      <div className="glass-card skeleton-panel skeleton-panel--ai">
        <Bone className="skeleton-bone--line" />
        <Bone className="skeleton-bone--paragraph" />
        <Bone className="skeleton-bone--line skeleton-bone--short" />
      </div>

      <div className="glass-card skeleton-panel skeleton-panel--chart">
        <Bone className="skeleton-bone--title skeleton-bone--narrow" />
        <Bone className="skeleton-bone--chart" />
        <div className="skeleton-grid">
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
        </div>
      </div>

      <div className="skeleton-grid skeleton-grid--2">
        <div className="glass-card skeleton-panel">
          <Bone className="skeleton-bone--chart skeleton-bone--sm" />
        </div>
        <div className="glass-card skeleton-panel">
          <Bone className="skeleton-bone--chart skeleton-bone--sm" />
        </div>
      </div>

      <div className="skeleton-grid skeleton-grid--2">
        <div className="glass-card skeleton-panel">
          <Bone className="skeleton-bone--chips" />
        </div>
        <div className="glass-card skeleton-panel">
          <Bone className="skeleton-bone--chips" />
        </div>
      </div>

      <div className="glass-card skeleton-panel">
        <Bone className="skeleton-bone--rec" />
        <Bone className="skeleton-bone--rec" />
        <Bone className="skeleton-bone--rec skeleton-bone--short" />
      </div>
    </motion.div>
  );
}
