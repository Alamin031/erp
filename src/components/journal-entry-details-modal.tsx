"use client";

import { JournalEntry } from "@/types/accounting";
import { motion } from "framer-motion";

interface JournalEntryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}

export function JournalEntryDetailsModal({
  isOpen,
  onClose,
  entry,
}: JournalEntryDetailsModalProps) {
  if (!isOpen || !entry) return null;

  const totalDebits = entry.lines.filter((l) => l.type === "Debit").reduce((sum, l) => sum + l.amount, 0);
  const totalCredits = entry.lines.filter((l) => l.type === "Credit").reduce((sum, l) => sum + l.amount, 0);

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: "800px" }}
        >
          <div className="modal-header">
            <h2>Journal Entry Details</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-form">
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px",
                background: "var(--background)",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>
                  {entry.referenceNumber}
                </h3>
                <p style={{ margin: "0", fontSize: "14px", color: "var(--secondary)" }}>
                  Date: {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: entry.isPosted ? "#28a745" : "#0066cc",
                  backgroundColor: entry.isPosted ? "#28a74520" : "#0066cc20",
                }}
              >
                {entry.isPosted ? "Posted" : "Draft"}
              </span>
            </div>

            {/* Description */}
            {entry.description && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Description
                </h4>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                    lineHeight: "1.5",
                  }}
                >
                  {entry.description}
                </div>
              </div>
            )}

            {/* Journal Lines */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Journal Lines
              </h4>
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                        Account
                      </th>
                      <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                        Description
                      </th>
                      <th style={{ padding: "10px 16px", textAlign: "right", fontSize: "11px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                        Debit
                      </th>
                      <th style={{ padding: "10px 16px", textAlign: "right", fontSize: "11px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.lines.map((line, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: index < entry.lines.length - 1 ? "1px solid var(--border)" : "none",
                          background: "var(--card-bg)",
                        }}
                      >
                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                          {line.accountCode} - {line.accountName}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--secondary)" }}>
                          {line.description || "-"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: line.type === "Debit" ? "var(--foreground)" : "var(--secondary)" }}>
                          {line.type === "Debit" ? `$${line.amount.toFixed(2)}` : "-"}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: line.type === "Credit" ? "var(--foreground)" : "var(--secondary)" }}>
                          {line.type === "Credit" ? `$${line.amount.toFixed(2)}` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "var(--background)", borderTop: "2px solid var(--border)" }}>
                      <td colSpan={2} style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>
                        Total
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>
                        ${totalDebits.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "14px", fontWeight: "700", color: "var(--foreground)" }}>
                        ${totalCredits.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Balance Check */}
            <div
              style={{
                padding: "12px 16px",
                background: totalDebits === totalCredits ? "rgba(40, 167, 69, 0.1)" : "rgba(220, 53, 69, 0.1)",
                border: `1px solid ${totalDebits === totalCredits ? "#28a745" : "#dc3545"}`,
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", color: totalDebits === totalCredits ? "#28a745" : "#dc3545" }}>
                {totalDebits === totalCredits 
                  ? "✓ Entry is balanced" 
                  : `⚠ Entry is out of balance by $${Math.abs(totalDebits - totalCredits).toFixed(2)}`
                }
              </p>
            </div>

            {/* Metadata */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Entry Information
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>Created By</p>
                  <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                    {entry.createdBy}
                  </p>
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--secondary)", textTransform: "uppercase" }}>Created Date</p>
                  <p style={{ margin: "0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
