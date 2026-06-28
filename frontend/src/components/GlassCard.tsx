import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cardHover, fadeUp } from "../lib/motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  accent?: "default" | "cyan" | "purple" | "green" | "orange" | "amber" | "rose" | "indigo" | "blue" | "emerald";
}

const accentGradients = {
  default: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(34, 211, 238, 0.05))",
  cyan: "linear-gradient(135deg, rgba(34, 211, 238, 0.12), rgba(6, 182, 212, 0.08))",
  purple: "linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(139, 92, 246, 0.08))",
  green: "linear-gradient(135deg, rgba(52, 211, 153, 0.12), rgba(34, 211, 238, 0.08))",
  orange: "linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(251, 191, 36, 0.08))",
  amber: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(251, 191, 36, 0.08))",
  rose: "linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(225, 29, 72, 0.08))",
  indigo: "linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(79, 70, 229, 0.08))",
  blue: "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.08))",
  emerald: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08))",
};

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  accent = "default",
  onClick,
}: GlassCardProps) {
  const backgroundGradient = accentGradients[accent];

  return (
    <motion.div
      className={`glass-card ${className}`.trim()}
      style={{ background: backgroundGradient }}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? cardHover.hover : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
