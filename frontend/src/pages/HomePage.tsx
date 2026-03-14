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
      <section className="app-page app-home-page">
        <div className="app-section-head">
          <div className="app-section-copy">
            <p className="app-kicker">Overview</p>
            <h2 className="mt-3 text-3xl font-semibold" data-testid="home-title">
              Dashboard
            </h2>
            <p className="text-muted mt-2 text-sm">
              Practice folder, file, and role-based flows from one central dashboard.
            </p>
          </div>
          <div className="app-status-chip">Workspace overview</div>
        </div>

        <div className="app-home-bento">
          <section className="app-workspace app-home-hero" data-testid="home-overview-card">
            <div className="app-home-hero-copy">
              <p className="app-kicker">Workspace</p>
              <h3 className="app-home-hero-title">
                Use this space to practice folders, files, permissions, and navigation.
              </h3>
              <p className="text-muted app-home-hero-text">
                Explore the app with different roles, work with folders and files, and observe how
                available actions change across the main screens.
              </p>

              <div className="app-home-signal-row" data-testid="home-signal-row">
                <div className="app-home-signal-pill">Folders</div>
                <div className="app-home-signal-pill">Files</div>
                <div className="app-home-signal-pill">Roles</div>
              </div>

              <div className="app-home-overview-grid">
                <div className="app-home-overview-card">
                  <span className="app-home-overview-label">Signed in as</span>
                  <span className="app-home-overview-value">{user?.username ?? "Guest"}</span>
                </div>
                <div className="app-home-overview-card">
                  <span className="app-home-overview-label">Current role</span>
                  <span className="app-home-overview-value role-capitalize">{user?.role ?? "guest"}</span>
                </div>
                <div className="app-home-overview-card">
                  <span className="app-home-overview-label">Main areas</span>
                  <span className="app-home-overview-value">Folders and Files</span>
                </div>
              </div>
            </div>

            <div className="app-home-role-grid">
              <div className="app-home-role-card">
                <p className="app-home-role-label">Admin</p>
                <p className="app-home-role-copy">
                  Full control across folders and files, including delete operations.
                </p>
              </div>
              <div className="app-home-role-card">
                <p className="app-home-role-label">Editor</p>
                <p className="app-home-role-copy">
                  Can create, edit, and upload content without destructive delete access.
                </p>
              </div>
              <div className="app-home-role-card">
                <p className="app-home-role-label">Viewer</p>
                <p className="app-home-role-copy">
                  Read-only access for browsing folders, files, and shared workspace data.
                </p>
              </div>
            </div>
          </section>

          <section
            className="app-workspace app-home-tile app-home-stats"
            data-testid="stats-folders-card"
          >
            <div className="app-home-tile-head">
              <p className="app-kicker">Live Storage</p>
              <span className="app-home-meta">Synced summary</span>
            </div>
            <div className="app-home-stat-grid">
              <div className="app-home-stat-card">
                <p className="app-home-stat-label">Folders</p>
                <p className="app-home-stat-value" data-testid="stats-total-folders">
                  {loading ? "..." : stats.totalFolders}
                </p>
                <p className="text-muted app-home-stat-copy">Folders currently available</p>
                <div className="app-home-stat-meter" aria-hidden="true">
                  <span className="app-home-stat-meter-bar is-strong" />
                  <span className="app-home-stat-meter-bar is-mid" />
                  <span className="app-home-stat-meter-bar is-soft" />
                </div>
              </div>
              <div className="app-home-stat-card" data-testid="stats-files-card">
                <p className="app-home-stat-label">Files</p>
                <p className="app-home-stat-value" data-testid="stats-total-files">
                  {loading ? "..." : stats.totalFiles}
                </p>
                <p className="text-muted app-home-stat-copy">Files stored across the workspace</p>
                <div className="app-home-stat-meter" aria-hidden="true">
                  <span className="app-home-stat-meter-bar is-strong" />
                  <span className="app-home-stat-meter-bar is-mid" />
                  <span className="app-home-stat-meter-bar is-soft" />
                </div>
              </div>
            </div>
            <div className="app-home-stat-footer" aria-hidden="true">
              <span className="app-home-stat-footer-line" />
              <span className="app-home-stat-footer-line is-short" />
            </div>
          </section>

          <section className="app-workspace app-home-tile app-home-practice">
            <div className="app-home-tile-head">
              <p className="app-kicker">Key Flows</p>
              <span className="app-home-meta">Common actions</span>
            </div>
            <div className="app-home-stack">
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">01</span>
                <div>
                  <p className="app-home-stack-title">Create and organize folders</p>
                  <p className="text-muted app-home-stack-copy">
                    Set up folder structures that keep content tidy and easy to browse.
                  </p>
                </div>
              </div>
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">02</span>
                <div>
                  <p className="app-home-stack-title">Upload and manage files</p>
                  <p className="text-muted app-home-stack-copy">
                    Add files into the right folder and work with them based on your permissions.
                  </p>
                </div>
              </div>
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">03</span>
                <div>
                  <p className="app-home-stack-title">Move through protected areas</p>
                  <p className="text-muted app-home-stack-copy">
                    Navigate confidently knowing the interface adapts to the role you signed in with.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
