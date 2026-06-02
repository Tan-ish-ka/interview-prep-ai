import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cardHover, fadeUp } from "../lib/motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${className}`.trim()}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? cardHover.hover : undefined}
    >
      {children}
    </motion.div>
  );
}
