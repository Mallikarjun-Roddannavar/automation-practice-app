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
        className={`app-drawer fixed left-0 top-0 z-40 h-screen w-72 p-4 transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-testid="sidebar-drawer"
      >
        <div className="mb-6 flex items-center justify-end">
          <button
            className="btn-secondary px-3 py-1 text-sm"
            onClick={onClose}
            data-testid="sidebar-close-btn"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            onClick={onClose}
            data-testid="nav-home"
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/folders"
            onClick={onClose}
            data-testid="nav-folders"
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Folders
          </NavLink>
          <NavLink
            to="/preferences"
            onClick={onClose}
            data-testid="nav-preferences"
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 ${isActive ? "nav-link-active" : ""}`
            }
          >
            Preferences
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
