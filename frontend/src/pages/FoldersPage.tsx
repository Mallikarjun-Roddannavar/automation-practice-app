import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { api } from "../api";
import { AppLayout } from "../components/AppLayout";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import type { Folder } from "../types";

export function FoldersPage() {
  const navigate = useNavigate();
  const { user, canCreateEdit, canDelete, isViewer } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);
  const [deletingFoldersBulk, setDeletingFoldersBulk] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedFolderIds, setSelectedFolderIds] = useState<string[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const emptyState = useMemo(() => !loading && folders.length === 0, [folders.length, loading]);

  async function refresh() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const nextFolders = await api.listFolders(user);
      setFolders(nextFolders);
      setSelectedFolderIds((prev) => prev.filter((id) => nextFolders.some((f) => f.id === id)));
      setLastSyncedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      refresh();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [user]);

  async function createFolder() {
    if (!user || !newName.trim()) return;
    setSubmitting(true);
    setError("");
    setCreateError("");
    try {
      await api.createFolder(user, newName.trim());
      setNewName("");
      setShowCreate(false);
      await refresh();
      toast.success("Folder created");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create folder";
      setCreateError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function renameFolder() {
    if (!user || !editingFolder || !newName.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await api.renameFolder(user, editingFolder.id, newName.trim());
      setEditingFolder(null);
      setNewName("");
      await refresh();
      toast.success("Folder renamed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to rename folder";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteFolder() {
    if (!user || !deletingFolder) return;
    setSubmitting(true);
    setError("");
    try {
      await api.deleteFolder(user, deletingFolder.id);
      setDeletingFolder(null);
      await refresh();
      toast.success("Folder deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete folder";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteSelectedFolders() {
    if (!user || selectedFolderIds.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      await Promise.all(selectedFolderIds.map((id) => api.deleteFolder(user, id)));
      setSelectedFolderIds([]);
      setDeletingFoldersBulk(false);
      await refresh();
      toast.success("Selected folders deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete selected folders";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function toggleFolderSelection(folderId: string) {
    setSelectedFolderIds((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  }

  function toggleAllFolders() {
    if (selectedFolderIds.length === folders.length) {
      setSelectedFolderIds([]);
    } else {
      setSelectedFolderIds(folders.map((f) => f.id));
    }
  }

  return (
    <AppLayout>
      <section className="app-page">
        <div className="app-section-head">
          <div className="app-section-copy">
            <p className="app-kicker">Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold" data-testid="folders-title">
              Folders
            </h2>
            <p className="text-muted mt-2 text-sm">
              Manage folder creation, renaming, navigation, and cleanup from one readable work
              surface.
            </p>
          </div>
          <div className="app-meta-row">
            <div className="app-status-chip">Role: {user?.role ?? "guest"}</div>
            <div className="app-status-chip">Selected: {selectedFolderIds.length}</div>
          </div>
        </div>

        <div className="app-workspace">
          <div className="app-toolbar">
            <p className="text-muted text-xs" data-testid="folders-last-synced">
              Last synced at: {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : "--"}
            </p>
            <div className="app-toolbar-group">
              <button
                className="btn-secondary px-4 py-2"
                onClick={refresh}
                data-testid="folders-refresh-btn"
              >
                Refresh
              </button>
              {!isViewer && (
                <button
                  className="btn-primary px-4 py-2 disabled:opacity-60"
                  onClick={() => {
                    setCreateError("");
                    setNewName("");
                    setShowCreate(true);
                  }}
                  disabled={!canCreateEdit}
                  data-testid="new-folder-btn"
                >
                  New Folder
                </button>
              )}
              {!isViewer && (
                <button
                  className="btn-danger px-4 py-2 disabled:opacity-60"
                  onClick={() => setDeletingFoldersBulk(true)}
                  disabled={!canDelete || selectedFolderIds.length === 0}
                  data-testid="folders-bulk-delete-btn"
                >
                  Delete Selected
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="app-alert app-alert-danger mt-4" data-testid="folders-error">
              {error}
            </p>
          )}

          <div className="app-table-wrap">
            <table className="app-table text-left">
              <thead className="text-sm">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={folders.length > 0 && selectedFolderIds.length === folders.length}
                      onChange={toggleAllFolders}
                      data-testid="folders-select-all"
                    />
                  </th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {folders.map((folder, index) => (
                  <tr key={folder.id} data-testid={`folder-row-${index + 1}`}>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedFolderIds.includes(folder.id)}
                        onChange={() => toggleFolderSelection(folder.id)}
                        data-testid={`folder-select-${folder.id}`}
                      />
                    </td>
                    <td className="p-3">{folder.name}</td>
                    <td className="p-3">{new Date(folder.createdAt).toLocaleString()}</td>
                    <td className="p-3">{folder.owner}</td>
                    <td className="p-3">
                      <div className="app-row-actions">
                        <button
                          className="btn-secondary px-3 py-2 disabled:opacity-60"
                          onClick={() => navigate(`/folders/${folder.id}`)}
                          disabled={!selectedFolderIds.includes(folder.id)}
                          data-testid={`folder-open-btn-${folder.id}`}
                        >
                          Open
                        </button>
                        <a
                          className={`btn-secondary px-3 py-2 ${
                            !selectedFolderIds.includes(folder.id)
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                          href={`/folders/${folder.id}`}
                          target="_blank"
                          rel="noreferrer"
                          data-testid={`folder-open-new-tab-${folder.id}`}
                        >
                          Open in New Tab
                        </a>
                        <button
                          className="btn-secondary px-3 py-2 disabled:opacity-60"
                          onClick={() => {
                            setEditingFolder(folder);
                            setNewName(folder.name);
                          }}
                          disabled={!canCreateEdit || !selectedFolderIds.includes(folder.id)}
                          data-testid={`folder-rename-btn-${folder.id}`}
                        >
                          Rename
                        </button>
                        {!isViewer && (
                          <button
                            className="btn-danger px-3 py-2 disabled:opacity-60"
                            onClick={() => setDeletingFolder(folder)}
                            disabled={!canDelete || !selectedFolderIds.includes(folder.id)}
                            data-testid={`folder-delete-btn-${folder.id}`}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {emptyState && (
              <p className="app-empty-state" data-testid="folders-empty">
                No folders yet.
              </p>
            )}
          </div>
        </div>
      </section>

      {showCreate && (
        <Modal
          title="Create Folder"
          testId="create-folder-modal"
          onClose={() => {
            setShowCreate(false);
            setCreateError("");
          }}
        >
          <input
            className="app-input"
            value={newName}
            onChange={(event) => {
              setNewName(event.target.value);
              if (createError) setCreateError("");
            }}
            data-testid="create-folder-input"
          />
          {createError && (
            <p className="app-alert app-alert-danger mt-3" data-testid="create-folder-error">
              {createError}
            </p>
          )}
          <div className="app-dialog-actions">
            <button
              className="btn-primary px-4 py-2 disabled:opacity-60"
              onClick={createFolder}
              disabled={!newName.trim() || submitting}
              data-testid="create-folder-submit"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </Modal>
      )}

      {editingFolder && (
        <Modal
          title={`Rename Folder: ${editingFolder.name}`}
          testId="rename-folder-modal"
          onClose={() => setEditingFolder(null)}
        >
          <input
            className="app-input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            data-testid="rename-folder-input"
          />
          <div className="app-dialog-actions">
            <button
              className="btn-primary px-4 py-2 disabled:opacity-60"
              onClick={renameFolder}
              disabled={!newName.trim() || submitting}
              data-testid="rename-folder-submit"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {deletingFolder && (
        <ConfirmDialog
          message={`Delete folder "${deletingFolder.name}"?`}
          testId="delete-folder-dialog"
          onCancel={() => setDeletingFolder(null)}
          onConfirm={deleteFolder}
        />
      )}
      {deletingFoldersBulk && (
        <ConfirmDialog
          message={`Delete ${selectedFolderIds.length} selected folder(s)?`}
          testId="delete-folders-bulk-dialog"
          onCancel={() => setDeletingFoldersBulk(false)}
          onConfirm={deleteSelectedFolders}
        />
      )}
    </AppLayout>
  );
}

