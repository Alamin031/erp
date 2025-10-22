"use client";

import { Document } from "@/types/document";
import { Eye, MoreVertical, RotateCcw, X } from "lucide-react";
import { useState } from "react";

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onManage: (doc: Document) => void;
  onCancel: (doc: Document) => void;
  onResend: (doc: Document) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
  sent: { bg: "bg-blue-100", text: "text-blue-800", label: "Sent" },
  partially_signed: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Partially Signed" },
  completed: { bg: "bg-green-100", text: "text-green-800", label: "Completed" },
  approved: { bg: "bg-green-200", text: "text-green-900", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
  expired: { bg: "bg-gray-200", text: "text-gray-900", label: "Expired" },
};

export function DocumentCard({
  document,
  onView,
  onManage,
  onCancel,
  onResend,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const status = STATUS_COLORS[document.status] || STATUS_COLORS.draft;
  const isExpired = new Date(document.expiresAt) < new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const pendingSigners = document.signers.filter((s) => s.status === "pending").length;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--primary)] transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--foreground)] text-sm truncate">
            {document.title}
          </h3>
          <p className="text-xs text-[var(--secondary)] mt-0.5">{document.id}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-[var(--background)] rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  onView(document);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors first:rounded-t-lg"
              >
                View
              </button>
              <button
                onClick={() => {
                  onManage(document);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
              >
                Manage
              </button>
              {document.status !== "draft" && document.status !== "expired" && (
                <button
                  onClick={() => {
                    onResend(document);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--background)] transition-colors"
                >
                  Resend
                </button>
              )}
              {document.status !== "expired" && document.status !== "approved" && (
                <button
                  onClick={() => {
                    onCancel(document);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-700 transition-colors last:rounded-b-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Owner */}
      <div className="mb-3 pb-3 border-b border-[var(--border)]">
        <p className="text-xs text-[var(--secondary)]">Owner</p>
        <p className="text-sm font-medium text-[var(--foreground)]">
          {document.owner.name}
        </p>
      </div>

      {/* Signers avatars */}
      <div className="mb-3">
        <p className="text-xs text-[var(--secondary)] mb-2">Signers</p>
        <div className="flex items-center gap-1 -space-x-2">
          {document.signers.slice(0, 3).map((signer) => (
            <div
              key={signer.id}
              className="w-8 h-8 rounded-full border-2 border-[var(--card-bg)] bg-[var(--primary)]/20 flex items-center justify-center text-xs font-semibold text-[var(--primary)]"
              title={signer.name}
            >
              {signer.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {document.signers.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-[var(--card-bg)] bg-[var(--background)] flex items-center justify-center text-xs text-[var(--secondary)]">
              +{document.signers.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Status & Dates */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          {isExpired && (
            <span className="text-xs text-red-600 font-medium">Expired</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[var(--secondary)]">Sent</p>
            <p className="text-[var(--foreground)] font-medium">
              {document.sentAt ? formatDate(document.sentAt) : "—"}
            </p>
          </div>
          <div>
            <p className="text-[var(--secondary)]">Expires</p>
            <p className={`font-medium ${isExpired ? "text-red-600" : "text-[var(--foreground)]"}`}>
              {formatDate(document.expiresAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Pending signers */}
      {pendingSigners > 0 && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 font-medium">
            {pendingSigners} pending signature{pendingSigners !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Actions */}
      <button
        onClick={() => onView(document)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[var(--primary)] hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity"
      >
        <Eye className="w-4 h-4" />
        View Document
      </button>
    </div>
  );
}
