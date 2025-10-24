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

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', label: "Draft" },
  sent: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: "Sent" },
  partially_signed: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', label: "Partially Signed" },
  completed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: "Completed" },
  approved: { bg: 'rgba(34, 197, 94, 0.15)', text: '#16a34a', label: "Approved" },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: "Rejected" },
  expired: { bg: 'rgba(107, 114, 128, 0.15)', text: '#4b5563', label: "Expired" },
};

export function DocumentCard({
  document,
  onView,
  onManage,
  onCancel,
  onResend,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const status = STATUS_CONFIG[document.status] || STATUS_CONFIG.draft;
  const isExpired = document.expiresAt ? new Date(document.expiresAt) < new Date() : false;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const pendingSigners = document.signers.filter((s) => s.status === "pending").length;

  return (
    <div 
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 20,
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontWeight: 600, 
            color: 'var(--foreground)', 
            fontSize: 15,
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {document.title}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>{document.id}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ 
            fontSize: 11, 
            fontWeight: 600, 
            padding: '4px 10px', 
            borderRadius: 6,
            background: status.bg,
            color: status.text
          }}>
            {status.label}
          </span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: 4,
                borderRadius: 6,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div 
                  style={{ 
                    position: 'fixed', 
                    inset: 0, 
                    zIndex: 10 
                  }} 
                  onClick={() => setShowMenu(false)} 
                />
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 4,
                  minWidth: 160,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => {
                      onView(document);
                      setShowMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: 13,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      onManage(document);
                      setShowMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 14px',
                      fontSize: 13,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'var(--foreground)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Manage
                  </button>
                  {document.status !== "draft" && document.status !== "expired" && (
                    <button
                      onClick={() => {
                        onResend(document);
                        setShowMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: 13,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: 'var(--foreground)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        fontSize: 13,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#ef4444'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Owner & Signers */}
      <div style={{ 
        marginBottom: 16, 
        paddingBottom: 16, 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 16
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Owner</p>
          <p style={{ 
            fontSize: 14, 
            fontWeight: 500, 
            color: 'var(--foreground)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {document.owner.name}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: -8 }}>
            {document.signers.slice(0, 3).map((signer, idx) => (
              <div
                key={signer.id}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid var(--card)',
                  background: `hsl(${idx * 60}, 70%, 60%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'white',
                  marginLeft: -8
                }}
                title={signer.name}
              >
                {signer.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {document.signers.length > 3 && (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '2px solid var(--card)',
                background: 'var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--muted)',
                marginLeft: -8
              }}>
                +{document.signers.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>Sent</p>
          <p style={{ color: 'var(--foreground)', fontWeight: 500, fontSize: 14 }}>
            {document.sentAt ? formatDate(document.sentAt) : "—"}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>Expires</p>
          <p style={{ 
            fontWeight: 500, 
            fontSize: 14,
            color: isExpired ? '#ef4444' : 'var(--foreground)'
          }}>
            {formatDate(document.expiresAt)}
          </p>
        </div>
      </div>

      {/* Pending signers badge */}
      {pendingSigners > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(234, 179, 8, 0.1)',
            color: '#eab308',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600
          }}>
            {pendingSigners} pending signature{pendingSigners !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onView(document)}
        className="btn btn-primary"
        style={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 8,
          fontSize: 14,
          fontWeight: 500
        }}
      >
        <Eye size={16} />
        View Document
      </button>
    </div>
  );
}
