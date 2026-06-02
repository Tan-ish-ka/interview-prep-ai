import { Trophy, User } from "lucide-react";
import type { Profile } from "../types/report";

interface ProfileSummaryProps {
  profile: Profile;
  totalSolved: number;
}

export function ProfileSummary({ profile, totalSolved }: ProfileSummaryProps) {
  return (
    <section className="glass-card section-card">
      <div className="section-card__header">
        <User size={22} />
        <h2>Profile summary</h2>
      </div>
      <div className="stat-grid">
        <div className="profile-highlight">
          <span className="profile-highlight__handle">@{profile.username}</span>
          <span className="profile-highlight__platform">{profile.platform}</span>
        </div>
      </div>
      <div className="stat-grid" style={{ marginTop: "1rem" }}>
        <div className="inline-stat">
          <Trophy size={16} />
          <span>Current {profile.current_rating ?? "—"}</span>
        </div>
        <div className="inline-stat">
          <Trophy size={16} />
          <span>Peak {profile.max_rating ?? "—"}</span>
        </div>
        <div className="inline-stat">
          <span>{totalSolved} problems solved</span>
        </div>
      </div>
    </section>
  );
}
