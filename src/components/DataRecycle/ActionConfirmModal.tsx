"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export type ActionType = "restore" | "archive" | "delete";

interface ActionConfirmModalProps {
  isOpen: boolean;
  actionType: ActionType;
  recordTitle: string;
  onConfirm: (note: string) => Promise<void>;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ActionConfirmModal({
  isOpen,
  actionType,
  recordTitle,
  onConfirm,
  onCancel,
  isDestructive = false,
}: ActionConfirmModalProps) {
  const [note, setNote] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [requiresConfirmation, setRequiresConfirmation] = useState(isDestructive);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titles = {
    restore: "Restore Record",
    archive: "Archive Record",
    delete: "Permanently Delete Record",
  };

  const messages = {
    restore: "This record will be restored to its original location.",
    archive: "This record will be archived and removed from active storage.",
    delete: "This action cannot be undone. The record will be permanently deleted.",
  };

  const confirmStrings = {
    restore: "RESTORE",
    archive: "ARCHIVE",
    delete: "DELETE PERMANENTLY",
  };

  const buttonColors = {
    restore: "bg-green-600 hover:bg-green-700",
    archive: "bg-blue-600 hover:bg-blue-700",
    delete: "bg-red-600 hover:bg-red-700",
  };

  const handleConfirm = async () => {
    if (
      requiresConfirmation &&
      confirmText !== confirmStrings[actionType]
    ) {
      setError(`Please type "${confirmStrings[actionType]}" to confirm`);
      return;
    }

    if (!note.trim() && actionType === "delete") {
      setError("Please provide a reason for this action");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(note);
      setNote("");
      setConfirmText("");
      setRequiresConfirmation(isDestructive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const canConfirm =
    !requiresConfirmation ||
    confirmText === confirmStrings[actionType];

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
                {titles[actionType]}
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
              {/* Warning */}
              {isDestructive && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Warning: Destructive Action
                    </p>
                    <p className="text-xs text-red-800 mt-1">
                      {messages[actionType]}
                    </p>
                  </div>
                </div>
              )}

              {/* Record Info */}
              <div className="bg-[var(--background)] rounded-lg p-3">
                <p className="text-xs text-[var(--secondary)] mb-1">
                  Affected Record
                </p>
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {recordTitle}
                </p>
              </div>

              {/* Audit Note */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Audit Note {actionType === "delete" && "*"}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason for this action..."
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              {/* Confirmation */}
              {requiresConfirmation && (
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Type to confirm: <span className="text-red-600 font-semibold">{confirmStrings[actionType]}</span>
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder={confirmStrings[actionType]}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono"
                    disabled={isLoading}
                  />
                </div>
              )}

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
                disabled={!canConfirm || isLoading}
                className={`flex-1 px-4 py-2 ${buttonColors[actionType]} text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? "Processing..." : titles[actionType]}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
