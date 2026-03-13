import { NavLink } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="app-overlay fixed inset-0 z-30"
          onClick={onClose}
          data-testid="sidebar-overlay"
          aria-label="Close menu overlay"
        />
      )}
      <aside
        className={`app-drawer fixed left-0 top-0 z-40 flex h-screen w-72 flex-col p-4 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="sidebar-drawer"
      >
        <div className="app-sidebar-head flex items-start justify-between gap-3">
          <div>
            <p className="app-header-eyebrow">Navigation</p>
            <p className="app-sidebar-title">Workspace Menu</p>
            <p className="app-sidebar-note">
              Move between dashboard, folders, and preferences without losing the current test flow.
            </p>
          </div>
          <button
            className="btn-secondary px-3 py-2 text-sm"
            onClick={onClose}
            data-testid="sidebar-close-btn"
          >
            Close
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          <NavLink
            to="/"
            onClick={onClose}
            data-testid="nav-home"
            className={({ isActive }) =>
              `nav-link rounded-xl px-3 py-3 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/folders"
            onClick={onClose}
            data-testid="nav-folders"
            className={({ isActive }) =>
              `nav-link rounded-xl px-3 py-3 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Folders
          </NavLink>
          <NavLink
            to="/preferences"
            onClick={onClose}
            data-testid="nav-preferences"
            className={({ isActive }) =>
              `nav-link rounded-xl px-3 py-3 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Preferences
          </NavLink>
        </nav>
        <div className="app-sidebar-footer">
          <p className="text-sm font-medium">Automation-friendly UI</p>
          <p className="text-muted mt-1 text-sm">
            Stable data-testid values remain the contract for Playwright selectors and flows.
          </p>
        </div>
      </aside>
    </>
  );
}
