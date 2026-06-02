import { motion } from "framer-motion";
import { Brain, LineChart, Target, Zap } from "lucide-react";

const CHIPS = [
  { icon: LineChart, label: "Rating trends" },
  { icon: Target, label: "Topic gaps" },
  { icon: Zap, label: "Activity pace" },
];

export function Hero() {
  return (
    <motion.header
      className="hero"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="hero__glow"
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero__badge"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Brain size={14} />
        Interview-ready analytics
      </motion.div>
      <h1 className="hero__title">
        <span className="gradient-text">Interview Prep AI</span>
      </h1>
      <p className="hero__subtitle">
        A premium prep command center for competitive programmers — turn any profile URL
        into actionable insights in seconds.
      </p>
      <motion.div
        className="hero__chips"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
        }}
      >
        {CHIPS.map(({ icon: Icon, label }) => (
          <motion.span key={label} className="hero-chip" variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
            <Icon size={14} />
            {label}
          </motion.span>
        ))}
      </motion.div>
    </motion.header>
  );
}
