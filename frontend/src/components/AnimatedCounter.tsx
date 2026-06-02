import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
}

export function AnimatedCounter({ value, decimals = 0, suffix = "" }: AnimatedCounterProps) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (current) =>
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString(),
  );
  const [text, setText] = useState("0");

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest) => setText(latest));
    return () => unsubscribe();
  }, [display]);

  return (
    <motion.span className="animated-counter">
      {text}
      {suffix}
    </motion.span>
  );
}
