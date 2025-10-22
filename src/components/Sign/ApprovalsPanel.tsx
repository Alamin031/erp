"use client";

import { useState } from "react";
import { useSign } from "@/store/useSign";
import { Document } from "@/types/document";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/toast";

interface ApprovalsPanelProps {
  onApprove?: (doc: Document, note: string) => Promise<void>;
  onReject?: (doc: Document, reason: string) => Promise<void>;
}

export function ApprovalsPanel({ onApprove, onReject }: ApprovalsPanelProps) {
  const { getPendingApprovals } = useSign();
  const { showToast } = useToast();

  const pendingDocs = getPendingApprovals();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approvalNote, setApprovalNote] = useState<Record<string, string>>({});
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleApprove = async (doc: Document) => {
    setIsLoading((prev) => ({ ...prev, [doc.id]: true }));
    try {
      await onApprove?.(doc, approvalNote[doc.id] || "");
      showToast(`Document "${doc.title}" approved`, "success");
      setApprovalNote((prev) => {
        const newNotes = { ...prev };
        delete newNotes[doc.id];
        return newNotes;
      });
    } catch (error) {
      showToast("Failed to approve document", "error");
    } finally {
      setIsLoading((prev) => ({ ...prev, [doc.id]: false }));
    }
  };

  const handleReject = async (doc: Document) => {
    if (!rejectionReason[doc.id]?.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }

    setIsLoading((prev) => ({ ...prev, [doc.id]: true }));
    try {
      await onReject?.(doc, rejectionReason[doc.id]);
      showToast(`Document "${doc.title}" rejected`, "success");
      setRejectionReason((prev) => {
        const newReasons = { ...prev };
        delete newReasons[doc.id];
        return newReasons;
      });
    } catch (error) {
      showToast("Failed to reject document", "error");
    } finally {
      setIsLoading((prev) => ({ ...prev, [doc.id]: false }));
    }
  };

  if (pendingDocs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-[var(--foreground)] font-medium">
            No pending approvals
          </p>
          <p className="text-xs text-[var(--secondary)] mt-1">
            All documents are up to date
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--foreground)]">
          Pending Approvals ({pendingDocs.length})
        </h3>
      </div>

      {pendingDocs.map((doc) => (
        <div
          key={doc.id}
          className="border border-[var(--border)] rounded-lg overflow-hidden"
        >
          {/* Summary */}
          <button
            onClick={() =>
              setExpandedId(expandedId === doc.id ? null : doc.id)
            }
            className="w-full text-left px-4 py-3 hover:bg-[var(--background)] transition-colors flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-[var(--foreground)]">
                {doc.title}
              </p>
              <p className="text-xs text-[var(--secondary)] mt-1">
                {doc.signers.length} signers • All signatures complete
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--secondary)]">
                {new Date(doc.completedAt || "").toLocaleDateString()}
              </p>
            </div>
          </button>

          {/* Details */}
          {expandedId === doc.id && (
            <div className="border-t border-[var(--border)] p-4 bg-[var(--background)] space-y-4">
              {/* Signers summary */}
              <div>
                <p className="text-sm font-medium text-[var(--foreground)] mb-2">
                  Signers
                </p>
                <div className="space-y-1">
                  {doc.signers.map((signer) => (
                    <div
                      key={signer.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[var(--secondary)]">
                        {signer.name}
                      </span>
                      <span className="text-green-600 font-medium">
                        ✓ Signed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval note */}
              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                  Approval Note (Optional)
                </label>
                <textarea
                  value={approvalNote[doc.id] || ""}
                  onChange={(e) =>
                    setApprovalNote((prev) => ({
                      ...prev,
                      [doc.id]: e.target.value,
                    }))
                  }
                  placeholder="Add any comments..."
                  className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--card-bg)] text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  rows={2}
                />
              </div>

              {/* Rejection reason */}
              <div>
                <label className="text-sm font-medium text-[var(--foreground)] mb-2 block">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason[doc.id] || ""}
                  onChange={(e) =>
                    setRejectionReason((prev) => ({
                      ...prev,
                      [doc.id]: e.target.value,
                    }))
                  }
                  placeholder="Explain why..."
                  className="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--card-bg)] text-[var(--foreground)] placeholder-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(doc)}
                  disabled={isLoading[doc.id]}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(doc)}
                  disabled={isLoading[doc.id]}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
