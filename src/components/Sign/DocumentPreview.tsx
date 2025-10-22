"use client";

import { useState } from "react";
import { Document } from "@/types/document";
import { X, Download, FileText, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RecipientList } from "./RecipientList";
import { AuditTrail } from "./AuditTrail";

interface DocumentPreviewProps {
  document: Document | null;
  onClose: () => void;
  onSignNow?: (doc: Document) => void;
  onApprove?: (doc: Document) => void;
  onReject?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
}

export function DocumentPreview({
  document,
  onClose,
  onSignNow,
  onApprove,
  onReject,
  onDownload,
}: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "recipients" | "audit">("preview");

  if (!document) return null;

  const isExpired = new Date(document.expiresAt) < new Date();
  const allSigned = document.signers.every((s) => s.status === "signed" || s.status === "rejected");

  return (
    <AnimatePresence>
      {document && (
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
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[var(--card-bg)] border-l border-[var(--border)] overflow-y-auto z-50 shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {document.title}
                </h2>
                <p className="text-sm text-[var(--secondary)] mt-1">
                  {document.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-[var(--background)] rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--border)] px-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "preview"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("recipients")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "recipients"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Recipients ({document.signers.length})
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "audit"
                      ? "border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  Audit
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Info */}
              <div className="bg-[var(--background)] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--secondary)]">
                    Status
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                    {document.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--secondary)]">
                    Expires
                  </span>
                  <span className={`text-sm font-medium ${isExpired ? "text-red-600" : "text-[var(--foreground)]"}`}>
                    {new Date(document.expiresAt).toLocaleDateString()}
                    {isExpired && " (Expired)"}
                  </span>
                </div>

                {document.message && (
                  <div>
                    <p className="text-sm font-medium text-[var(--secondary)] mb-1">
                      Message
                    </p>
                    <p className="text-sm text-[var(--foreground)]">
                      {document.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "preview" && (
                <div className="space-y-4">
                  {/* Document Preview */}
                  <div className="bg-[var(--background)] rounded-lg p-4 min-h-96 flex items-center justify-center border border-[var(--border)]">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-[var(--secondary)] mx-auto mb-3 opacity-50" />
                      <p className="text-[var(--secondary)]">
                        PDF Preview
                      </p>
                      <p className="text-xs text-[var(--secondary)] mt-1">
                        {document.fileName}
                      </p>
                      <p className="text-xs text-[var(--secondary)] mt-2">
                        Demo: PDF viewer not implemented
                      </p>
                    </div>
                  </div>

                  {/* Signature Fields */}
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-3">
                      Signature Fields
                    </h3>
                    <div className="space-y-2">
                      {document.signers.flatMap((signer) =>
                        signer.fields.map((field) => (
                          <div
                            key={field.id}
                            className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[var(--foreground)]">
                                  {signer.name}
                                </p>
                                <p className="text-xs text-[var(--secondary)]">
                                  Page {field.page} • Position ({field.x}, {field.y})
                                </p>
                              </div>
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  field.status === "signed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {field.status === "signed" ? "✓ Signed" : "Pending"}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "recipients" && (
                <RecipientList document={document} onSignNow={onSignNow} />
              )}

              {activeTab === "audit" && (
                <AuditTrail document={document} />
              )}
            </div>

            {/* Actions Footer */}
            <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-[var(--border)] px-6 py-4 space-y-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(document)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] text-[var(--foreground)] font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}

              {document.status === "completed" && (
                <>
                  {onApprove && (
                    <button
                      onClick={() => onApprove(document)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Document
                    </button>
                  )}
                  {onReject && (
                    <button
                      onClick={() => onReject(document)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Reject Document
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
