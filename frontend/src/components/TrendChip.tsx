import { motion } from "framer-motion";
import { Activity, TrendingDown, TrendingUp } from "lucide-react";

interface TrendChipProps {
  trend: string;
}

export function TrendChip({ trend }: TrendChipProps) {
  const Icon =
    trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Activity;

  return (
    <motion.span
      className={`trend-chip trend-chip--${trend}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Icon size={14} strokeWidth={2.5} />
      {trend}
    </motion.span>
  );
}
