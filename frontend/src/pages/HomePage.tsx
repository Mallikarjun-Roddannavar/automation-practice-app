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
              A sharper workspace for role-based validation, storage visibility, and realistic
              automation practice flows.
            </p>
          </div>
          <div className="app-status-chip">Bento workspace overview</div>
        </div>

        <div className="app-home-bento">
          <section className="app-workspace app-home-hero" data-testid="home-overview-card">
            <div className="app-home-hero-copy">
              <p className="app-kicker">Automation Focus</p>
              <h3 className="app-home-hero-title">
                Validate UI and API behavior from one clean, role-aware workspace.
              </h3>
              <p className="text-muted app-home-hero-text">
                This app is structured for realistic Playwright practice: stable selectors,
                role-based permissions, deep-link coverage, uploads, downloads, dialogs, and
                predictable cleanup paths.
              </p>
            </div>

            <div className="app-home-signal-row" data-testid="home-signal-row">
              <div className="app-home-signal-pill">Stable test IDs</div>
              <div className="app-home-signal-pill">RBAC validation</div>
              <div className="app-home-signal-pill">UI + API coverage</div>
            </div>

            <div className="app-home-role-grid">
              <div className="app-home-role-card">
                <p className="app-home-role-label">Admin</p>
                <p className="app-home-role-copy">
                  Full create, edit, upload, and delete coverage for complete path validation.
                </p>
              </div>
              <div className="app-home-role-card">
                <p className="app-home-role-label">Editor</p>
                <p className="app-home-role-copy">
                  Productive authoring flows without destructive access, ideal for boundary checks.
                </p>
              </div>
              <div className="app-home-role-card">
                <p className="app-home-role-label">Viewer</p>
                <p className="app-home-role-copy">
                  Read-only visibility and navigation paths for negative and permission testing.
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
                <p className="text-muted app-home-stat-copy">Current folder inventory</p>
              </div>
              <div className="app-home-stat-card" data-testid="stats-files-card">
                <p className="app-home-stat-label">Files</p>
                <p className="app-home-stat-value" data-testid="stats-total-files">
                  {loading ? "..." : stats.totalFiles}
                </p>
                <p className="text-muted app-home-stat-copy">Stored file surface</p>
              </div>
            </div>
          </section>

          <section className="app-workspace app-home-tile app-home-practice">
            <div className="app-home-tile-head">
              <p className="app-kicker">Practice Paths</p>
              <span className="app-home-meta">Common scenarios</span>
            </div>
            <div className="app-home-stack">
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">01</span>
                <div>
                  <p className="app-home-stack-title">Folder and file CRUD</p>
                  <p className="text-muted app-home-stack-copy">
                    Exercise dialogs, updates, uploads, and role-based restrictions.
                  </p>
                </div>
              </div>
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">02</span>
                <div>
                  <p className="app-home-stack-title">Auth and navigation</p>
                  <p className="text-muted app-home-stack-copy">
                    Cover sign-in, preferences, callback routes, and protected access.
                  </p>
                </div>
              </div>
              <div className="app-home-stack-item">
                <span className="app-home-stack-index">03</span>
                <div>
                  <p className="app-home-stack-title">RBAC boundary checks</p>
                  <p className="text-muted app-home-stack-copy">
                    Compare admin, editor, and viewer visibility against backend rules.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="app-workspace app-home-tile app-home-quality">
            <div className="app-home-tile-head">
              <p className="app-kicker">Quality Signals</p>
              <span className="app-home-meta">Why it works</span>
            </div>
            <div className="app-home-quality-grid">
              <div className="app-home-quality-card">
                <p className="app-home-quality-title">Selector hygiene</p>
                <p className="text-muted app-home-quality-copy">
                  Stable `data-testid` attributes keep UI automation maintainable.
                </p>
              </div>
              <div className="app-home-quality-card">
                <p className="app-home-quality-title">Deep-link coverage</p>
                <p className="text-muted app-home-quality-copy">
                  Direct folder routes help exercise state restoration and navigation logic.
                </p>
              </div>
              <div className="app-home-quality-card">
                <p className="app-home-quality-title">Shared behavior surface</p>
                <p className="text-muted app-home-quality-copy">
                  The same environment supports UI, API, and mixed validation paths.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </AppLayout>
  );
}
