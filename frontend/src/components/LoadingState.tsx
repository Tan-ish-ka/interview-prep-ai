import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <motion.div
      className="loading-banner glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="spin" size={22} />
      <span>Synthesizing your interview prep report…</span>
      <div className="loading-banner__dots">
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
      </div>
    </motion.div>
  );
}
