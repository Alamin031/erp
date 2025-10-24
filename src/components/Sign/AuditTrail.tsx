"use client";

import { Document } from "@/types/document";
import { Download } from "lucide-react";

interface AuditTrailProps {
  doc: Document;
}

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  created: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
  sent: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
  viewed: { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4' },
  signed: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
  approved: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
  expired: { bg: 'rgba(249, 115, 22, 0.1)', text: '#f97316' },
  resent: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1' },
  cancelled: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

export function AuditTrail({ doc }: AuditTrailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleExportAudit = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Details"],
      ...doc.auditTrail.map((entry) => [
        formatDate(entry.timestamp),
        entry.userName,
        entry.action,
        entry.details,
      ]),
    ]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const element = window.document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    );
    element.setAttribute("download", `audit_trail_${doc.id}.csv`);
    element.style.display = "none";
    window.document.body.appendChild(element);
    element.click();
    window.document.body.removeChild(element);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 12,
        padding: '16px 20px',
        background: 'var(--background)',
        borderRadius: 10,
        border: '1px solid var(--border)'
      }}>
        <div style={{ flex: '1 1 auto', minWidth: 150 }}>
          <h3 style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 16, marginBottom: 4 }}>
            Audit Trail
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {doc.auditTrail.length} {doc.auditTrail.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <button
          onClick={handleExportAudit}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            padding: '8px 16px',
            whiteSpace: 'nowrap'
          }}
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Timeline Container */}
      <div style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0
      }}>
        {doc.auditTrail.map((entry, idx) => {
          const colors = ACTION_COLORS[entry.action] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
          const isLast = idx === doc.auditTrail.length - 1;
          
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                paddingBottom: isLast ? 0 : 24,
                position: 'relative'
              }}
            >
              {/* Timeline Line & Dot */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative',
                paddingTop: 2,
                minWidth: 12,
                flexShrink: 0
              }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: colors.text,
                    border: '3px solid var(--card)',
                    boxShadow: `0 0 0 1px ${colors.text}`,
                    position: 'relative',
                    zIndex: 2
                  }}
                />
                {!isLast && (
                  <div 
                    style={{ 
                      width: 2, 
                      position: 'absolute',
                      top: 16,
                      bottom: -24,
                      background: 'var(--border)'
                    }} 
                  />
                )}
              </div>

              {/* Content Card */}
              <div 
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: 16,
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.text;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${colors.bg}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 10
                }}>
                  {/* Header Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 14, marginBottom: 4, wordBreak: 'break-word' }}>
                        {entry.userName}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '6px 12px',
                        borderRadius: 6,
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.text}33`,
                        flexShrink: 0
                      }}
                    >
                      {entry.action.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Details */}
                  <p style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6, wordBreak: 'break-word' }}>
                    {entry.details}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {doc.auditTrail.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 20px',
          background: 'var(--background)',
          borderRadius: 10,
          border: '1px solid var(--border)'
        }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            background: 'rgba(107, 114, 128, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Download size={24} style={{ color: 'var(--muted)', opacity: 0.5 }} />
          </div>
          <p style={{ color: 'var(--foreground)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
            No audit entries yet
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Activity history will appear here once actions are taken
          </p>
        </div>
      )}
    </div>
  );
}
