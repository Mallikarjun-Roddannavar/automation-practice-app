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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <section className="app-workspace" data-testid="home-overview-card">
            <p className="app-kicker">Workspace Guide</p>
            <h3 className="mt-3 text-2xl font-semibold">What this environment helps you validate</h3>
            <p className="text-muted mt-3 text-sm">
              Use this workspace to practice realistic UI and API automation with stable selectors,
              role-based behavior, dialogs, uploads, downloads, and deep-link navigation.
            </p>

            <div className="app-login-role-grid mt-6">
              <div className="app-login-role-card">
                <p className="text-muted text-xs uppercase tracking-[0.12em]">Admin</p>
                <p className="mt-2 font-semibold">Create, edit, delete, and validate full access</p>
              </div>
              <div className="app-login-role-card">
                <p className="text-muted text-xs uppercase tracking-[0.12em]">Editor</p>
                <p className="mt-2 font-semibold">Manage content without delete permissions</p>
              </div>
              <div className="app-login-role-card">
                <p className="text-muted text-xs uppercase tracking-[0.12em]">Viewer</p>
                <p className="mt-2 font-semibold">Verify read-only flows and visibility rules</p>
              </div>
            </div>

            <div className="app-preview-tile mt-6">
              <p className="text-sm font-medium">Why this environment is useful</p>
              <div className="app-login-checklist mt-4 text-sm text-muted">
                <div className="app-login-checklist-item">Folder and file CRUD flows</div>
                <div className="app-login-checklist-item">Stable test IDs for Playwright selectors</div>
                <div className="app-login-checklist-item">OAuth and username/password sign-in paths</div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4">
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
        </div>
      </section>
    </AppLayout>
  );
}
