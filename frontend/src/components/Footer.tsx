import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p>Interview Prep AI — analytics for competitive programming interview prep.</p>
    </motion.footer>
  );
}
