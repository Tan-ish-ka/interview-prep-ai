import { motion } from "framer-motion";
import { ArrowRight, Link2, Loader2, Sparkles } from "lucide-react";

interface CommandBarProps {
  url: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
}

export function CommandBar({ url, loading, onUrlChange, onSubmit }: CommandBarProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <motion.form
      className="command-bar glass-card"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="command-bar__glow" />
      <label className="command-bar__label" htmlFor="profile-url">
        <Sparkles size={14} />
        Analyze profile
      </label>
      <div className="command-bar__row">
        <div className={`command-bar__input ${loading ? "command-bar__input--busy" : ""}`}>
          <Link2 size={18} className="command-bar__icon" />
          <input
            id="profile-url"
            type="url"
            placeholder="Paste a Codeforces, LeetCode, or CodeChef URL..."
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="btn-primary command-bar__cta"
          disabled={loading || !url.trim()}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="spin" size={18} />
              Analyzing
            </>
          ) : (
            <>
              Generate Report
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
