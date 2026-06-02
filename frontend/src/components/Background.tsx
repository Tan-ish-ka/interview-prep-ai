import { motion } from "framer-motion";

export function Background() {
  return (
    <div className="bg-effects" aria-hidden>
      <div className="bg-grid" />
      <motion.div
        className="bg-blob bg-blob--1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-blob bg-blob--2"
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-blob bg-blob--3"
        animate={{ x: [0, 30, 0], y: [0, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
