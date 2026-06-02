import { ArrowRight, Link2 } from "lucide-react";

interface UrlFormProps {
  url: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
}

export function UrlForm({ url, loading, onUrlChange, onSubmit }: UrlFormProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="glass-card url-form" onSubmit={handleSubmit}>
      <label className="url-form__label" htmlFor="profile-url">
        Profile URL
      </label>
      <div className="url-form__row">
        <div className="url-form__input-wrap">
          <Link2 size={18} className="url-form__input-icon" />
          <input
            id="profile-url"
            type="url"
            placeholder="https://codeforces.com/profile/tourist"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading || !url.trim()}>
          {loading ? "Generating…" : "Generate Report"}
          {!loading ? <ArrowRight size={18} /> : null}
        </button>
      </div>
      <p className="url-form__hint">Supports Codeforces profiles today. LeetCode and CodeChef detection coming soon.</p>
    </form>
  );
}
