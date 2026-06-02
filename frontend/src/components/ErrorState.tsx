import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <GlassCard className="state-panel state-panel--error" hover={false}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <AlertCircle size={40} className="state-panel__icon-error" />
      </motion.div>
      <h2>Report unavailable</h2>
      <p>{message}</p>
    </GlassCard>
  );
}
