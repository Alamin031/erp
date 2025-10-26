"use client";

import React, { useState } from "react";
import type { Report } from "@/store/useReports";

interface ReportTableProps {
  reports: Report[];
  onViewDetails?: (report: Report) => void;
  onExport?: (report: Report) => void;
}

export function ReportTable({
  reports,
  onViewDetails,
  onExport,
}: ReportTableProps) {
  const [sortBy, setSortBy] = useState<keyof Report>("date" as keyof Report);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedReports = [...reports].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle null/undefined consistently: put undefined values after defined ones in ascending order.
    const aNull = aVal === null || aVal === undefined;
    const bNull = bVal === null || bVal === undefined;
    if (aNull || bNull) {
      if (aNull && bNull) return 0;
      return aNull
        ? sortOrder === "asc"
          ? 1
          : -1
        : sortOrder === "asc"
        ? -1
        : 1;
    }

    // If both are strings, compare case-insensitively.
    if (typeof aVal === "string" && typeof bVal === "string") {
      const aStr = aVal.toLowerCase();
      const bStr = bVal.toLowerCase();
      if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
      if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    // Try numeric/date comparison when possible.
    const toNumberSafe = (v: unknown) => {
      if (typeof v === "number") return v as number;
      if (v instanceof Date) return v.getTime();
      const n = Number(v);
      return Number.isNaN(n) ? NaN : n;
    };

    const aNum = toNumberSafe(aVal);
    const bNum = toNumberSafe(bVal);
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      if (aNum < bNum) return sortOrder === "asc" ? -1 : 1;
      if (aNum > bNum) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }

    // Fallback to string comparison for mixed or unknown types.
    const aStr = String(aVal);
    const bStr = String(bVal);
    if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
    if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedReports.length / itemsPerPage)
  );
  const paginatedReports = sortedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Report) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  if (reports.length === 0) {
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
        <p style={{ margin: 0, fontSize: "14px" }}>No reports found</p>
      </div>
    );
  }

  const getStatusColor = (type?: string) => {
    return type === "Revenue" ? "#28a745" : "#dc3545";
  };

  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: keyof Report;
  }) => (
    <th
      onClick={() => handleSort(field)}
      style={{
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "12px",
        fontWeight: "600",
        color: "var(--secondary)",
        textTransform: "uppercase",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--secondary)";
      }}
    >
      {label}
      {sortBy === field && (
        <span style={{ marginLeft: "6px" }}>
          {sortOrder === "asc" ? "↑" : "↓"}
        </span>
      )}
    </th>
  );

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
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
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--background)",
                }}
              >
                <SortHeader label="Report ID" field="id" />
                <SortHeader label="Date" field="date" />
                <SortHeader label="Category" field="name" />
                <SortHeader label="Amount" field="amount" />
                <SortHeader label="Type" field="type" />
                <SortHeader label="Created By" field="agent" />
                <th
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--secondary)",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--background)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                  }}
                >
                  <td
                    style={{
                      padding: "12px 16px",
                      fontWeight: "600",
                      color: "var(--primary)",
                      fontSize: "13px",
                    }}
                  >
                    {report.id}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--secondary)",
                    }}
                  >
                    {report.date
                      ? new Date(report.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--foreground)",
                    }}
                  >
                    {report.name ?? report.type ?? "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--foreground)",
                    }}
                  >
                    {report.amount != null
                      ? `$${Number(report.amount).toLocaleString()}`
                      : "-"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: getStatusColor(report.type),
                        backgroundColor: `${getStatusColor(report.type)}20`,
                      }}
                    >
                      {report.type ?? "-"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--secondary)",
                    }}
                  >
                    {report.agent ?? report.createdBy ?? "-"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => onViewDetails?.(report)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--foreground)",
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "var(--border)";
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => onExport?.(report)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--primary)",
                          background: "transparent",
                          border: "1px solid var(--primary)",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              color: currentPage === 1 ? "var(--secondary)" : "var(--primary)",
              background: "transparent",
              border: `1px solid ${
                currentPage === 1 ? "var(--border)" : "var(--primary)"
              }`,
              borderRadius: "4px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              color:
                currentPage === totalPages
                  ? "var(--secondary)"
                  : "var(--primary)",
              background: "transparent",
              border: `1px solid ${
                currentPage === totalPages ? "var(--border)" : "var(--primary)"
              }`,
              borderRadius: "4px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
