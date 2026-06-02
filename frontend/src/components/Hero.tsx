import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <motion.header
      className="hero hero--compact"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero__row">
        <div className="hero__brand">
          <span className="hero__mark">
            <Sparkles size={16} />
          </span>
          <div>
            <h1 className="hero__title">
              <span className="gradient-text">Interview Prep AI</span>
            </h1>
            <p className="hero__subtitle">
              Profile intelligence for interview-ready competitive programmers.
            </p>
          </div>
        </div>
        <motion.span
          className="hero__pill"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Live analytics
        </motion.span>
      </div>
    </motion.header>
  );
}
