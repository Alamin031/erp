"use client";

import { JournalEntry } from "@/types/accounting";

interface LedgerTableProps {
  entries: JournalEntry[];
  onViewDetails?: (entry: JournalEntry) => void;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (entryId: string) => void;
}

export function LedgerTable({ entries, onViewDetails, onEdit, onDelete }: LedgerTableProps) {
  if (entries.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>No ledger entries found</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Date
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Reference
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Description
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Debit
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Credit
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const totalDebits = entry.lines.filter((l) => l.type === "Debit").reduce((sum, l) => sum + l.amount, 0);
              const totalCredits = entry.lines.filter((l) => l.type === "Credit").reduce((sum, l) => sum + l.amount, 0);

              return (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--background)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: "600", color: "var(--primary)" }}>
                    {entry.referenceNumber}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--foreground)" }}>
                    {entry.description || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                    {totalDebits > 0 ? `$${totalDebits.toFixed(2)}` : "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                    {totalCredits > 0 ? `$${totalCredits.toFixed(2)}` : "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: entry.isPosted ? "#28a745" : "#0066cc",
                        backgroundColor: entry.isPosted ? "#28a74520" : "#0066cc20",
                      }}
                    >
                      {entry.isPosted ? "Posted" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => onViewDetails?.(entry)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--foreground)",
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      {!entry.isPosted && (
                        <>
                          <button
                            onClick={() => onEdit?.(entry)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#0066cc",
                              background: "transparent",
                              border: "1px solid #0066cc",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete?.(entry.id)}
                            style={{
                              padding: "4px 8px",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#dc3545",
                              background: "transparent",
                              border: "1px solid #dc3545",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
