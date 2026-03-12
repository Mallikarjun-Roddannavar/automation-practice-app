import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { api } from "../api";
import { AppLayout } from "../components/AppLayout";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Modal } from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import type { FileItem, Folder } from "../types";

export function FilesPage() {
  const { folderId = "" } = useParams();
  const navigate = useNavigate();
  const { user, canCreateEdit, canDelete, isViewer } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [deletingFile, setDeletingFile] = useState<FileItem | null>(null);
  const [deletingFilesBulk, setDeletingFilesBulk] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const currentFolder = folders.find((f) => f.id === folderId);

  async function refresh() {
    if (!user || !folderId) return;
    setError("");
    try {
      const [allFolders, folderFiles] = await Promise.all([
        api.listFolders(user),
        api.listFiles(user, folderId)
      ]);
      setFolders(allFolders);
      setFiles(folderFiles);
      setSelectedFileIds((prev) => prev.filter((id) => folderFiles.some((f) => f.id === id)));
      setLastSyncedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    }
  }

  useEffect(() => {
    refresh();
  }, [user, folderId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      refresh();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [user, folderId]);

  async function upload() {
    if (!user || !selectedFile || !folderId) return;
    try {
      await api.uploadFile(user, folderId, selectedFile);
      setSelectedFile(null);
      setShowUploadDialog(false);
      await refresh();
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload file");
    }
  }

  async function renameFile() {
    if (!user || !folderId || !renamingFile || !newName.trim()) return;
    try {
      await api.renameFile(user, folderId, renamingFile.id, newName.trim());
      setRenamingFile(null);
      setNewName("");
      await refresh();
      toast.success("File renamed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename file");
    }
  }

  async function deleteFile() {
    if (!user || !folderId || !deletingFile) return;
    try {
      await api.deleteFile(user, folderId, deletingFile.id);
      setDeletingFile(null);
      await refresh();
      toast.success("File deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete file");
    }
  }

  async function deleteSelectedFiles() {
    if (!user || !folderId || selectedFileIds.length === 0) return;
    try {
      await Promise.all(selectedFileIds.map((id) => api.deleteFile(user, folderId, id)));
      setDeletingFilesBulk(false);
      setSelectedFileIds([]);
      await refresh();
      toast.success("Selected files deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete selected files");
    }
  }

  function toggleFileSelection(fileId: string) {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  }

  function toggleAllFiles() {
    if (selectedFileIds.length === files.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map((f) => f.id));
    }
  }

  function previewFile(fileId: string) {
    if (!user || !folderId) return;
    const url = api.buildFilePreviewUrl(user, folderId, fileId);
    window.open(url, `preview-${fileId}`, "width=760,height=560,resizable=yes,scrollbars=yes");
  }

  function downloadFile(fileId: string) {
    if (!user || !folderId) return;
    const url = api.buildFileDownloadUrl(user, folderId, fileId);
    window.open(url, `_blank`);
  }

  function downloadMultipleFiles(fileIds?: string[]) {
    if (!user || !folderId) return;
    const url = api.buildFilesDownloadUrl(user, folderId, fileIds);
    window.open(url, `_blank`);
  }

  return (
    <AppLayout>
      <div className="flex items-center gap-2">
        <button
          className="btn-secondary px-3 py-1"
          onClick={() => navigate("/folders")}
          data-testid="files-back-btn"
        >
          Back to folders
        </button>
        <button
          className="btn-secondary px-3 py-1"
          onClick={refresh}
          data-testid="files-refresh-btn"
        >
          Refresh
        </button>
        {!isViewer && (
          <button
            className="btn-primary px-3 py-1 disabled:opacity-60"
            onClick={() => setShowUploadDialog(true)}
            disabled={!canCreateEdit}
            data-testid="files-upload-action-btn"
          >
            Upload File
          </button>
        )}
        <button
          className="btn-secondary px-3 py-1 disabled:opacity-60"
          onClick={() => downloadMultipleFiles()}
          disabled={files.length === 0}
          data-testid="files-download-all-btn"
        >
          Download All
        </button>
        {canDelete && (
          <button
            className="btn-secondary px-3 py-1 disabled:opacity-60"
            onClick={() => downloadMultipleFiles(selectedFileIds)}
            disabled={selectedFileIds.length === 0}
            data-testid="files-download-selected-btn"
          >
            Download Selected
          </button>
        )}
        {!isViewer && (
          <button
            className="btn-danger px-3 py-1 disabled:opacity-60"
            onClick={() => setDeletingFilesBulk(true)}
            disabled={!canDelete || selectedFileIds.length === 0}
            data-testid="files-bulk-delete-btn"
          >
            Delete Selected
          </button>
        )}
      </div>
      <h2 className="mt-4 text-2xl font-semibold" data-testid="files-title">
        Files in {currentFolder?.name ?? "Folder"}
      </h2>
      <p className="text-muted mt-2 text-xs" data-testid="files-last-synced">
        Last synced at: {lastSyncedAt ? lastSyncedAt.toLocaleTimeString() : "--"}
      </p>

      {error && (
        <p className="mt-3 text-sm text-red-600" data-testid="files-error">
          {error}
        </p>
      )}

      <div className="app-card mt-5 overflow-x-auto">
        <table className="app-table text-left">
          <thead className="text-sm">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={files.length > 0 && selectedFileIds.length === files.length}
                  onChange={toggleAllFiles}
                  data-testid="files-select-all"
                />
              </th>
              <th className="p-3">Name</th>
              <th className="p-3">Size</th>
              <th className="p-3">Uploaded By</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={file.id} data-testid={`file-row-${index + 1}`}>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedFileIds.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    data-testid={`file-select-${file.id}`}
                  />
                </td>
                <td className="p-3">{file.name}</td>
                <td className="p-3">{file.size}</td>
                <td className="p-3">{file.uploadedBy}</td>
                <td className="p-3">{new Date(file.uploadedAt).toLocaleString()}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="btn-secondary px-3 py-1 disabled:opacity-60"
                      onClick={() => {
                        setRenamingFile(file);
                        setNewName(file.name);
                      }}
                      disabled={!canCreateEdit || !selectedFileIds.includes(file.id)}
                      data-testid={`file-rename-btn-${file.id}`}
                    >
                      Rename
                    </button>
                    <button
                      className="btn-secondary px-3 py-1 disabled:opacity-60"
                      onClick={() => previewFile(file.id)}
                      disabled={!selectedFileIds.includes(file.id)}
                      data-testid={`file-preview-btn-${file.id}`}
                    >
                      Preview
                    </button>
                    <button
                      className="btn-secondary px-3 py-1 disabled:opacity-60"
                      onClick={() => downloadFile(file.id)}
                      disabled={!selectedFileIds.includes(file.id)}
                      data-testid={`file-download-btn-${file.id}`}
                    >
                      Download
                    </button>
                    {!isViewer && (
                      <button
                        className="btn-danger px-3 py-1 disabled:opacity-60"
                        onClick={() => setDeletingFile(file)}
                        disabled={!canDelete || !selectedFileIds.includes(file.id)}
                        data-testid={`file-delete-btn-${file.id}`}
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
        {files.length === 0 && (
          <p className="text-muted p-4 text-sm" data-testid="files-empty">
            No files in this folder.
          </p>
        )}
      </div>

      {renamingFile && (
        <Modal
          title={`Rename File: ${renamingFile.name}`}
          testId="rename-file-modal"
          onClose={() => setRenamingFile(null)}
        >
          <input
            className="app-input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            data-testid="rename-file-input"
          />
          <button
            className="btn-primary mt-3 px-4 py-2"
            onClick={renameFile}
            data-testid="rename-file-submit"
          >
            Save
          </button>
        </Modal>
      )}

      {showUploadDialog && (
        <Modal
          title="Upload File"
          testId="upload-file-modal"
          onClose={() => {
            setShowUploadDialog(false);
            setSelectedFile(null);
          }}
        >
          <input
            type="file"
            className="app-input mt-2 block"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            data-testid="upload-file-input"
            disabled={!canCreateEdit}
          />
          <button
            className="btn-primary mt-3 px-4 py-2 disabled:opacity-60"
            onClick={upload}
            disabled={!selectedFile || !canCreateEdit}
            data-testid="upload-file-btn"
          >
            Upload File
          </button>
        </Modal>
      )}

      {deletingFile && (
        <ConfirmDialog
          message={`Delete file "${deletingFile.name}"?`}
          testId="delete-file-dialog"
          onCancel={() => setDeletingFile(null)}
          onConfirm={deleteFile}
        />
      )}
      {deletingFilesBulk && (
        <ConfirmDialog
          message={`Delete ${selectedFileIds.length} selected file(s)?`}
          testId="delete-files-bulk-dialog"
          onCancel={() => setDeletingFilesBulk(false)}
          onConfirm={deleteSelectedFiles}
        />
      )}
    </AppLayout>
  );
}
