"use client";

import { useState } from "react";
import { RecycledRecord } from "@/types/recycle";
import { X, RotateCcw, Archive, Trash2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RecordPreviewProps {
  record: RecycledRecord | null;
  onClose: () => void;
  onRestore: (record: RecycledRecord) => void;
  onArchive: (record: RecycledRecord) => void;
  onDelete: (record: RecycledRecord) => void;
}

export function RecordPreview({
  record,
  onClose,
  onRestore,
  onArchive,
  onDelete,
}: RecordPreviewProps) {
  const [showJson, setShowJson] = useState(false);

  if (!record) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {record && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Slide-over */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--card-bg)] border-l border-[var(--border)] overflow-y-auto z-50 shadow-lg"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--foreground)] truncate">
                  {record.title}
                </h2>
                <p className="text-sm text-[var(--secondary)] mt-1">
                  ID: {record.recordId}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-[var(--background)] rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Audit Info */}
              <div className="bg-[var(--background)] rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-[var(--foreground)] text-sm">
                  Deletion Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary)]">Deleted By:</span>
                    <span className="text-[var(--foreground)] font-medium">
                      {record.deletedBy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary)]">Deleted At:</span>
                    <span className="text-[var(--foreground)] font-medium">
                      {formatDate(record.deletedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--secondary)]">Reason:</span>
                    <span className="text-[var(--foreground)] font-medium">
                      {record.deletionReason || "Not specified"}
                    </span>
                  </div>
                  {record.originalLocation && (
                    <div className="flex justify-between">
                      <span className="text-[var(--secondary)]">Location:</span>
                      <span className="text-[var(--foreground)] font-medium">
                        {record.originalLocation}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Storage */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--background)] rounded-lg p-3">
                  <p className="text-xs text-[var(--secondary)] mb-1">
                    Retention Status
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {record.retentionStatus}
                  </p>
                  {record.retentionStatusDaysLeft > 0 && (
                    <p className="text-xs text-[var(--secondary)] mt-1">
                      {record.retentionStatusDaysLeft} days left
                    </p>
                  )}
                </div>
                <div className="bg-[var(--background)] rounded-lg p-3">
                  <p className="text-xs text-[var(--secondary)] mb-1">
                    Storage Type
                  </p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {record.currentStorage}
                  </p>
                  {record.size && (
                    <p className="text-xs text-[var(--secondary)] mt-1">
                      {(record.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>

              {/* Archive Info */}
              {record.archivedAt && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Archive Info
                  </h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div className="flex justify-between">
                      <span>Archived At:</span>
                      <span className="font-medium">
                        {formatDate(record.archivedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Archived By:</span>
                      <span className="font-medium">{record.archivedBy}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {record.isProtected && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Protected Record
                    </p>
                    <p className="text-xs text-amber-800">
                      This record is protected and cannot be permanently deleted.
                    </p>
                  </div>
                </div>
              )}

              {record.onHold && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    On Legal Hold
                  </p>
                  <p className="text-xs text-orange-800">
                    {record.auditNotes || "Record is on legal hold"}
                  </p>
                </div>
              )}

              {/* Record Data */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[var(--foreground)] text-sm">
                    Record Data
                  </h3>
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    {showJson ? "Formatted" : "JSON"}
                  </button>
                </div>

                {showJson ? (
                  <pre className="bg-[var(--background)] rounded-lg p-3 text-xs overflow-x-auto text-[var(--foreground)]">
                    {JSON.stringify(record.data, null, 2)}
                  </pre>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(record.data).map(([key, value]) => (
                      <div key={key} className="bg-[var(--background)] rounded p-2">
                        <p className="text-xs text-[var(--secondary)] font-mono">
                          {key}
                        </p>
                        <p className="text-sm text-[var(--foreground)] font-medium">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-[var(--border)] px-6 py-4 space-y-2">
              <button
                onClick={() => onRestore(record)}
                disabled={record.isProtected}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore Record
              </button>
              <button
                onClick={() => onArchive(record)}
                disabled={record.currentStorage === "archived"}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive Record
              </button>
              <button
                onClick={() => onDelete(record)}
                disabled={record.isProtected}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Permanently Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
