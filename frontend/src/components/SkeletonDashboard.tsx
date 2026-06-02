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
    >
      <div className="glass-card skeleton-panel">
        <Bone className="skeleton-bone--title" />
        <div className="skeleton-grid">
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
          <Bone className="skeleton-bone--stat" />
        </div>
      </div>
      <div className="skeleton-grid skeleton-grid--2">
        <div className="glass-card skeleton-panel skeleton-panel--tall">
          <Bone className="skeleton-bone--chart" />
        </div>
        <div className="glass-card skeleton-panel skeleton-panel--tall">
          <Bone className="skeleton-bone--chart" />
        </div>
      </div>
      <div className="glass-card skeleton-panel">
        <Bone className="skeleton-bone--line" />
        <Bone className="skeleton-bone--line skeleton-bone--short" />
      </div>
    </motion.div>
  );
}
