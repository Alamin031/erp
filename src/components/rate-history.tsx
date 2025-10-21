"use client";

import { RateAuditLog } from "@/types/rates";

interface RateHistoryProps {
  logs: RateAuditLog[];
  onRollback?: (log: RateAuditLog) => void;
}

export function RateHistory({ logs, onRollback }: RateHistoryProps) {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const actionLabels: Record<string, string> = {
    create: "Created",
    update: "Updated",
    delete: "Deleted",
    approve: "Approved",
    reject: "Rejected",
  };

  const actionColors: Record<string, string> = {
    create: "#059669",
    update: "#2563eb",
    delete: "#dc3545",
    approve: "#059669",
    reject: "#f59e0b",
  };

  if (sortedLogs.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>No history records found</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "24px" }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Audit Trail
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedLogs.map((log, index) => (
            <div
              key={log.id}
              style={{
                padding: "12px",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      background: actionColors[log.action] || "#6b7280",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "600",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {actionLabels[log.action] || log.action}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                    {log.performedBy}
                  </span>
                </div>

                <div style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: "8px" }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>

                {log.changedFields && Object.keys(log.changedFields).length > 0 && (
                  <div style={{ fontSize: "11px", color: "var(--secondary)" }}>
                    <strong>Changes:</strong>
                    <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
                      {Object.entries(log.changedFields).map(([field, change]) => (
                        <li key={field}>
                          <span style={{ color: "var(--foreground)" }}>{field}:</span> {String(change.from)} →{" "}
                          {String(change.to)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {log.notes && (
                  <div style={{ fontSize: "11px", color: "var(--secondary)", fontStyle: "italic", marginTop: "4px" }}>
                    Note: {log.notes}
                  </div>
                )}
              </div>

              {log.action === "update" && onRollback && (
                <button
                  onClick={() => onRollback(log)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "var(--primary)",
                    background: "transparent",
                    border: "1px solid var(--primary)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Rollback
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
