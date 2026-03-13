import { useEffect, useState } from "react";

import { api } from "../api";
import { AppLayout } from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

type Stats = { totalFolders: number; totalFiles: number };

export function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalFolders: 0, totalFiles: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.stats(user)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <AppLayout>
      <section className="app-page">
        <div className="app-section-head">
          <div className="app-section-copy">
            <p className="app-kicker">Overview</p>
            <h2 className="mt-3 text-3xl font-semibold" data-testid="home-title">
              Dashboard
            </h2>
            <p className="text-muted mt-2 text-sm">
              A quick view of your folders and files, designed for fast validation and clear
              navigation.
            </p>
          </div>
          <div className="app-status-chip">Live system summary</div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="app-workspace" data-testid="stats-folders-card">
            <p className="app-kicker">Folders</p>
            <p className="mt-4 text-sm text-muted">Total folders currently available</p>
            <p className="mt-3 text-4xl font-bold" data-testid="stats-total-folders">
              {loading ? "..." : stats.totalFolders}
            </p>
          </div>
          <div className="app-workspace" data-testid="stats-files-card">
            <p className="app-kicker">Files</p>
            <p className="mt-4 text-sm text-muted">Total files currently stored</p>
            <p className="mt-3 text-4xl font-bold" data-testid="stats-total-files">
              {loading ? "..." : stats.totalFiles}
            </p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
