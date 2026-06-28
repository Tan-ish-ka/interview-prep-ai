import { motion } from "framer-motion";
import { BarChart3, Search } from "lucide-react";

export function EmptyState() {
  return (
    <motion.div
      className="empty-state glass-card"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-state__icon-wrap">
        <Search size={28} />
        <BarChart3 size={20} className="empty-state__icon-accent" />
      </div>
      <h2>Your analytics dashboard awaits</h2>
      <p>
        Paste a Codeforces, LeetCode, or CodeChef profile URL above to generate a full interview-prep
        report. If you have connected multiple accounts in the Platforms tab, the report will be unified.
      </p>
      <div className="empty-state__chips">
        <span>Rating trends</span>
        <span>Contest stats</span>
        <span>Topic insights</span>
      </div>
    </motion.div>
  );
}
