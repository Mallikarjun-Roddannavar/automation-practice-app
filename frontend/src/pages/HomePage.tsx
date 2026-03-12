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
      <h2 className="text-2xl font-semibold" data-testid="home-title">
        Dashboard
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="app-card p-5" data-testid="stats-folders-card">
          <p className="text-muted text-sm">Total Folders</p>
          <p className="text-3xl font-bold" data-testid="stats-total-folders">
            {loading ? "..." : stats.totalFolders}
          </p>
        </div>
        <div className="app-card p-5" data-testid="stats-files-card">
          <p className="text-muted text-sm">Total Files</p>
          <p className="text-3xl font-bold" data-testid="stats-total-files">
            {loading ? "..." : stats.totalFiles}
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
