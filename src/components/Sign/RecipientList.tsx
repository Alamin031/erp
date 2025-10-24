"use client";

import { Document } from "@/types/document";
import { Check, Clock, X } from "lucide-react";

interface RecipientListProps {
  document: Document;
  onSignNow?: (doc: Document) => void;
}

export function RecipientList({ document, onSignNow }: RecipientListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <Check size={18} style={{ color: '#22c55e' }} />;
      case "pending":
        return <Clock size={18} style={{ color: '#eab308' }} />;
      case "rejected":
        return <X size={18} style={{ color: '#ef4444' }} />;
      case "expired":
        return <X size={18} style={{ color: 'var(--muted)' }} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {document.signers.map((signer, idx) => (
        <div
          key={signer.id}
          style={{
            padding: 16,
            border: '1px solid var(--border)',
            borderRadius: 10,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(var(--primary-rgb), 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--primary)'
              }}>
                {signer.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 14, marginBottom: 2 }}>
                  {signer.name}
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{signer.email}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {getStatusIcon(signer.status)}
              <span style={{ fontSize: 12, fontWeight: 500, textTransform: 'capitalize', color: 'var(--foreground)' }}>
                {signer.status}
              </span>
            </div>
          </div>

          {/* Signing order indicator for sequential */}
          {document.signingOrder === "sequential" && (
            <div style={{ 
              marginBottom: 12, 
              padding: 8, 
              background: 'rgba(59, 130, 246, 0.1)', 
              border: '1px solid rgba(59, 130, 246, 0.3)', 
              borderRadius: 6,
              fontSize: 12,
              color: '#3b82f6',
              fontWeight: 500
            }}>
              Position: #{idx + 1} in signing order
            </div>
          )}

          {/* Status details */}
          {signer.status === "signed" && signer.signedAt && (
            <div style={{ 
              marginBottom: 12, 
              padding: 8, 
              background: 'rgba(34, 197, 94, 0.1)', 
              border: '1px solid rgba(34, 197, 94, 0.3)', 
              borderRadius: 6,
              fontSize: 12,
              color: '#22c55e',
              fontWeight: 500
            }}>
              Signed on {formatDate(signer.signedAt)} by {signer.signedBy}
            </div>
          )}

          {/* Fields status */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>
              Signature Fields ({signer.fields.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {signer.fields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 8,
                    background: 'var(--background)',
                    borderRadius: 6,
                    fontSize: 12
                  }}
                >
                  <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>
                    Page {field.page}
                  </span>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontWeight: 600,
                      fontSize: 11,
                      background: field.status === "signed" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: field.status === "signed" ? '#22c55e' : '#eab308'
                    }}
                  >
                    {field.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          {signer.status === "pending" && onSignNow && (
            <button
              onClick={() => onSignNow(document)}
              className="btn btn-primary"
              style={{
                width: '100%',
                fontSize: 14
              }}
            >
              Sign Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
