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
  onApprove?: (doc: Document, note?: string) => void | Promise<void>;
  onReject?: (doc: Document, reason?: string) => void | Promise<void>;
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

  const expiresAt = document.expiresAt ? new Date(document.expiresAt) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;
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
            className="slide-over-overlay"
          />

          {/* Slide-over */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="slide-over"
            style={{ 
              maxWidth: 700,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              position: 'sticky', 
              top: 0, 
              background: 'var(--card)', 
              borderBottom: '1px solid var(--border)', 
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              zIndex: 10,
              flexShrink: 0
            }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                <h2 style={{ 
                  fontSize: 18, 
                  fontWeight: 600, 
                  color: 'var(--foreground)', 
                  marginBottom: 6,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {document.title}
                </h2>
                <p style={{ 
                  fontSize: 13, 
                  color: 'var(--muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {document.id}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: 6,
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ 
              borderBottom: '1px solid var(--border)', 
              padding: '0 20px',
              flexShrink: 0,
              overflowX: 'auto',
              overflowY: 'hidden'
            }}>
              <div style={{ display: 'flex', gap: 24, minWidth: 'max-content' }}>
                <button
                  onClick={() => setActiveTab("preview")}
                  style={{
                    padding: '12px 0',
                    fontWeight: 500,
                    fontSize: 14,
                    transition: 'all 0.2s ease',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === "preview" ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === "preview" ? 'var(--primary)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== "preview") e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "preview") e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab("recipients")}
                  style={{
                    padding: '12px 0',
                    fontWeight: 500,
                    fontSize: 14,
                    transition: 'all 0.2s ease',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === "recipients" ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === "recipients" ? 'var(--primary)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== "recipients") e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "recipients") e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  Recipients ({document.signers.length})
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  style={{
                    padding: '12px 0',
                    fontWeight: 500,
                    fontSize: 14,
                    transition: 'all 0.2s ease',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === "audit" ? '2px solid var(--primary)' : '2px solid transparent',
                    color: activeTab === "audit" ? 'var(--primary)' : 'var(--muted)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== "audit") e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== "audit") e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  Audit
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ 
              padding: '20px',
              display: 'flex', 
              flexDirection: 'column', 
              gap: 20,
              overflowY: 'auto',
              overflowX: 'hidden',
              flex: 1
            }}>
              {/* Status Info */}
              <div style={{ 
                background: 'var(--background)', 
                borderRadius: 10, 
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
                    Status
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    whiteSpace: 'nowrap'
                  }}>
                    {document.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
                    Expires
                  </span>
                  <span style={{ 
                    fontSize: 13, 
                    fontWeight: 500, 
                    color: isExpired ? '#ef4444' : 'var(--foreground)',
                    whiteSpace: 'nowrap'
                  }}>
                    {expiresAt ? expiresAt.toLocaleDateString() : "—"}
                    {isExpired && " (Expired)"}
                  </span>
                </div>

                {document.message && (
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>
                      Message
                    </p>
                    <p style={{ 
                      fontSize: 13, 
                      color: 'var(--foreground)', 
                      lineHeight: 1.5,
                      wordBreak: 'break-word'
                    }}>
                      {document.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === "preview" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Document Preview */}
                  <div style={{ 
                    background: 'var(--background)', 
                    borderRadius: 10, 
                    padding: 40,
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <FileText size={64} style={{ color: 'var(--muted)', margin: '0 auto 16px', opacity: 0.5 }} />
                      <p style={{ color: 'var(--muted)', fontSize: 15, fontWeight: 500 }}>
                        PDF Preview
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                        {document.fileName}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
                        Demo: PDF viewer not implemented
                      </p>
                    </div>
                  </div>

                  {/* Signature Fields */}
                  <div>
                    <h3 style={{ fontWeight: 600, color: 'var(--foreground)', marginBottom: 12, fontSize: 15 }}>
                      Signature Fields
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {document.signers.flatMap((signer) =>
                        signer.fields.map((field) => (
                          <div
                            key={field.id}
                            style={{
                              padding: 12,
                              background: 'var(--background)',
                              borderRadius: 8,
                              border: '1px solid var(--border)'
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              justifyContent: 'space-between',
                              gap: 12,
                              flexWrap: 'wrap'
                            }}>
                              <div style={{ flex: 1, minWidth: 150 }}>
                                <p style={{ 
                                  fontSize: 14, 
                                  fontWeight: 500, 
                                  color: 'var(--foreground)', 
                                  marginBottom: 4,
                                  wordBreak: 'break-word'
                                }}>
                                  {signer.name}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                                  Page {field.page} • Position ({field.x}, {field.y})
                                </p>
                              </div>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '4px 10px',
                                  borderRadius: 6,
                                  background: field.status === "signed" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                  color: field.status === "signed" ? '#22c55e' : '#eab308',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0
                                }}
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
                <AuditTrail doc={document} />
              )}
            </div>

            {/* Actions Footer */}
            <div style={{ 
              position: 'sticky', 
              bottom: 0, 
              background: 'var(--card)', 
              borderTop: '1px solid var(--border)', 
              padding: '14px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              flexShrink: 0
            }}>
              {onDownload && (
                <button
                  onClick={() => onDownload(document)}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <Download size={16} />
                  Download PDF
                </button>
              )}

              {document.status === "completed" && (
                <>
                  {onApprove && (
                    <button
                      onClick={() => onApprove(document)}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: '#16a34a'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
                    >
                      <CheckCircle size={16} />
                      Approve Document
                    </button>
                  )}
                  {onReject && (
                    <button
                      onClick={() => onReject(document)}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        background: '#dc2626'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
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
