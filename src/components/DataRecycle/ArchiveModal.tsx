"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ArchiveModalProps {
  isOpen: boolean;
  recordTitle: string;
  recordSize?: number;
  onConfirm: (config: ArchiveConfig) => Promise<void>;
  onCancel: () => void;
}

export interface ArchiveConfig {
  target: "local" | "s3" | "cloud";
  compress: boolean;
  attachMetadata: boolean;
  readOnly: boolean;
  note: string;
}

export function ArchiveModal({
  isOpen,
  recordTitle,
  recordSize = 0,
  onConfirm,
  onCancel,
}: ArchiveModalProps) {
  const [target, setTarget] = useState<"local" | "s3" | "cloud">("local");
  const [compress, setCompress] = useState(true);
  const [attachMetadata, setAttachMetadata] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimatedSize = compress ? Math.ceil(recordSize * 0.7) : recordSize;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm({
        target,
        compress,
        attachMetadata,
        readOnly,
        note,
      });
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive record");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTarget("local");
    setCompress(true);
    setAttachMetadata(true);
    setReadOnly(true);
    setNote("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--card-bg)] rounded-lg border border-[var(--border)] shadow-xl z-50"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Archive Record
              </h2>
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="p-1 hover:bg-[var(--background)] rounded transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Record Info */}
              <div className="bg-[var(--background)] rounded-lg p-3">
                <p className="text-xs text-[var(--secondary)] mb-1">
                  Record
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {recordTitle}
                </p>
                {recordSize > 0 && (
                  <p className="text-xs text-[var(--secondary)] mt-1">
                    Current size: {(recordSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>

              {/* Archive Target */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
                  Archive Target
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--background)] transition-colors">
                    <input
                      type="radio"
                      name="target"
                      value="local"
                      checked={target === "local"}
                      onChange={(e) => setTarget(e.target.value as any)}
                      disabled={isLoading}
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Local Storage
                      </p>
                      <p className="text-xs text-[var(--secondary)]">
                        Store on this server
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--background)] transition-colors opacity-50">
                    <input
                      type="radio"
                      name="target"
                      value="s3"
                      disabled={true}
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        S3 Cloud Storage
                      </p>
                      <p className="text-xs text-[var(--secondary)]">
                        Not configured (demo)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg cursor-pointer hover:bg-[var(--background)] transition-colors opacity-50">
                    <input
                      type="radio"
                      name="target"
                      value="cloud"
                      disabled={true}
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Cloud Archive
                      </p>
                      <p className="text-xs text-[var(--secondary)]">
                        Not configured (demo)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 bg-[var(--background)] rounded-lg p-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={compress}
                    onChange={(e) => setCompress(e.target.checked)}
                    disabled={isLoading}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Compress Archive
                    </p>
                    <p className="text-xs text-[var(--secondary)]">
                      Reduces size to ~70%
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachMetadata}
                    onChange={(e) => setAttachMetadata(e.target.checked)}
                    disabled={isLoading}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Attach Metadata
                    </p>
                    <p className="text-xs text-[var(--secondary)]">
                      Include audit trail and deletion info
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readOnly}
                    onChange={(e) => setReadOnly(e.target.checked)}
                    disabled={isLoading}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Mark as Read-Only
                    </p>
                    <p className="text-xs text-[var(--secondary)]">
                      Prevent modifications in archive
                    </p>
                  </div>
                </label>
              </div>

              {/* Estimated Size */}
              {recordSize > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Estimated archived size:</strong>{" "}
                    {(estimatedSize / 1024).toFixed(1)} KB
                    {compress && " (compressed)"}
                  </p>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Archive Note (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any notes about this archival..."
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                  rows={2}
                  disabled={isLoading}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-[var(--border)] flex gap-2">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] font-medium hover:bg-[var(--background)] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Archiving..." : "Archive Record"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
