"use client";

import { useState } from "react";
import {
  RotateCcw,
  Archive,
  Trash2,
  Download,
  Lock,
  LockOpen,
  X,
} from "lucide-react";
import { useRecycleBin } from "@/store/useRecycleBin";
import { ArchiveModal, ArchiveConfig } from "./ArchiveModal";

interface BulkActionsMenuProps {
  selectedCount: number;
  onRestore: (ids: string[], note: string) => Promise<void>;
  onArchive: (ids: string[], config: ArchiveConfig) => Promise<void>;
  onDelete: (ids: string[], note: string) => Promise<void>;
  onHold: (ids: string[]) => Promise<void>;
  onRemoveHold: (ids: string[]) => Promise<void>;
}

export function BulkActionsMenu({
  selectedCount,
  onRestore,
  onArchive,
  onDelete,
  onHold,
  onRemoveHold,
}: BulkActionsMenuProps) {
  const { selectedRecordIds, clearSelection, records } = useRecycleBin();

  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteNote, setDeleteNote] = useState("");
  const [restoreNote, setRestoreNote] = useState("");
  const [showConfirmRestore, setShowConfirmRestore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (selectedCount === 0) {
    return null;
  }

  const selectedRecords = records.filter((r) => selectedRecordIds.includes(r.id));
  const canRestore = selectedRecords.some((r) => !r.isProtected);
  const canArchive = selectedRecords.some((r) => r.currentStorage === "active");
  const canDelete = selectedRecords.some((r) => !r.isProtected);
  const canExport = selectedCount > 0;

  const handleExport = (format: "csv" | "json") => {
    const data = selectedRecords.map((record) => ({
      recordId: record.recordId,
      module: record.module,
      title: record.title,
      deletedAt: record.deletedAt,
      deletedBy: record.deletedBy,
      status: record.retentionStatus,
      storage: record.currentStorage,
    }));

    let csv = "";
    if (format === "csv") {
      const headers = Object.keys(data[0]);
      csv = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header as keyof typeof row];
              return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
            })
            .join(",")
        ),
      ].join("\n");
    } else {
      csv = JSON.stringify(data, null, 2);
    }

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/${format === "csv" ? "csv" : "json"};charset=utf-8,${encodeURIComponent(csv)}`
    );
    element.setAttribute(
      "download",
      `recycle_export_${new Date().toISOString().split("T")[0]}.${format}`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRestoreConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onRestore(selectedRecordIds, restoreNote);
      setRestoreNote("");
      setShowConfirmRestore(false);
      clearSelection();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restore records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveConfirm = async (config: ArchiveConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      await onArchive(selectedRecordIds, config);
      setShowArchiveModal(false);
      clearSelection();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNote.trim()) {
      setError("Please provide a reason for deletion");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onDelete(selectedRecordIds, deleteNote);
      setDeleteNote("");
      setShowConfirmDelete(false);
      clearSelection();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete records");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-30 bg-[var(--primary)]/10 border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--foreground)]">
            {selectedCount} record{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={clearSelection}
            className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Restore */}
          <button
            onClick={() => setShowConfirmRestore(true)}
            disabled={!canRestore || isLoading}
            title={canRestore ? "Restore selected records" : "Some records cannot be restored"}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </button>

          {/* Archive */}
          <button
            onClick={() => setShowArchiveModal(true)}
            disabled={!canArchive || isLoading}
            title={canArchive ? "Archive selected records" : "Some records are already archived"}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={!canDelete || isLoading}
            title={canDelete ? "Delete selected records" : "Some records cannot be deleted"}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          {/* Export */}
          <div className="relative group">
            <button
              disabled={!canExport}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)] text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export selected records"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {canExport && (
              <div className="absolute right-0 mt-0 w-32 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] first:rounded-t-lg"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] last:rounded-b-lg"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Hold Management */}
          <button
            onClick={() => onHold(selectedRecordIds)}
            disabled={isLoading}
            title="Place hold on selected records"
            className="flex items-center gap-2 px-3 py-2 bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)] text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={() => onRemoveHold(selectedRecordIds)}
            disabled={isLoading}
            title="Remove hold from selected records"
            className="flex items-center gap-2 px-3 py-2 bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--foreground)] text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <LockOpen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Restore Confirm Modal */}
      {showConfirmRestore && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-md bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Restore {selectedCount} Record{selectedCount !== 1 ? "s" : ""}?
            </h3>
            <textarea
              value={restoreNote}
              onChange={(e) => setRestoreNote(e.target.value)}
              placeholder="Add audit note (optional)..."
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmRestore(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Restoring..." : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="w-full max-w-md bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-red-600">
              Permanently Delete {selectedCount} Record{selectedCount !== 1 ? "s" : ""}?
            </h3>
            <p className="text-sm text-[var(--secondary)]">
              This action cannot be undone. The records will be permanently deleted.
            </p>
            <textarea
              value={deleteNote}
              onChange={(e) => setDeleteNote(e.target.value)}
              placeholder="Reason for deletion (required)..."
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--background)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isLoading || !deleteNote.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      <ArchiveModal
        isOpen={showArchiveModal}
        recordTitle={`${selectedCount} record${selectedCount !== 1 ? "s" : ""}`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setShowArchiveModal(false)}
      />
    </>
  );
}
