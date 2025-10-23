"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ActivityLogEntry } from "@/types/cap-table";
import { Plus, Edit2, Trash2, Share2, ChevronUp, ChevronDown } from "lucide-react";

interface ActivityLogProps {
  activityLog: ActivityLogEntry[];
  limit?: number;
}

type SortField = "timestamp" | "type" | "entity";
type SortOrder = "asc" | "desc";

const typeIcons: Record<string, React.ReactNode> = {
  Added: <Plus size={14} />,
  Updated: <Edit2 size={14} />,
  Deleted: <Trash2 size={14} />,
  Transferred: <Share2 size={14} />,
};

const typeColors: Record<string, string> = {
  Added: "#059669",
  Updated: "#2563eb",
  Deleted: "#dc3545",
  Transferred: "#f59e0b",
};

export function CapTableActivityLog({ activityLog, limit = 20 }: ActivityLogProps) {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedLog = [...activityLog].slice(0, limit).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortOrder === "asc"
      ? (aValue as any) - (bValue as any)
      : (bValue as any) - (aValue as any);
  });

  const paginatedLog = sortedLog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedLog.length / itemsPerPage);

  if (activityLog.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>
          No activity recorded yet.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th
                onClick={() => handleSort("timestamp")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "160px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("type")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "110px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Type {sortField === "type" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("entity")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "100px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Entity {sortField === "entity" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "150px",
                }}
              >
                Entity Name
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "200px",
                }}
              >
                Details
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "100px",
                }}
              >
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLog.map((log, idx) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}>
                  {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 8px",
                      backgroundColor: `${typeColors[log.type] || "#6b7280"}20`,
                      color: typeColors[log.type] || "#6b7280",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {typeIcons[log.type]}
                    {log.type}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "12px", fontWeight: "500" }}>
                  {log.entity}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}>
                  {log.entityName}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}>
                  <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {log.details}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "12px", fontWeight: "500" }}>
                  {log.user}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: currentPage === 1 ? "var(--secondary)" : "var(--primary)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "500",
                color: currentPage === totalPages ? "var(--secondary)" : "var(--primary)",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
