"use client";

import { useState } from "react";
import { Rate } from "@/types/rates";
import { RateStatusBadge } from "./rate-status-badge";
import { useToast } from "./toast";

interface RatesTableProps {
  rates: Rate[];
  onRowClick?: (rate: Rate) => void;
  onEdit?: (rate: Rate) => void;
  onClone?: (rate: Rate) => void;
  onDelete?: (id: string) => void;
  onHistory?: (rate: Rate) => void;
}

type SortField = keyof Rate;
type SortOrder = "asc" | "desc";

export function RatesTable({
  rates,
  onRowClick,
  onEdit,
  onClone,
  onDelete,
  onHistory,
}: RatesTableProps) {
  const { showToast } = useToast();
  const [sortField, setSortField] = useState<SortField>("basePrice");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRates = [...rates].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    }

    return sortOrder === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const paginatedRates = sortedRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(rates.length / itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedRates.map((r) => r.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this rate?")) {
      onDelete?.(id);
      showToast("Rate deleted successfully", "success");
    }
  };

  if (rates.length === 0) {
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
        <p style={{ margin: 0, fontSize: "14px" }}>
          No rates found. Create a new rate to get started.
        </p>
      </div>
    );
  }

  return (
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
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th style={{ padding: "12px 16px", width: "40px" }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.size === paginatedRates.length && paginatedRates.length > 0}
                  style={{ cursor: "pointer" }}
                />
              </th>
              <th
                onClick={() => handleSort("code")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Code {sortField === "code" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("roomType")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Room Type {sortField === "roomType" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("rateType")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Type {sortField === "rateType" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("effectiveFrom")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                From {sortField === "effectiveFrom" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("effectiveTo")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                To {sortField === "effectiveTo" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("basePrice")}
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Price {sortField === "basePrice" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                }}
              >
                Channels
              </th>
              <th
                onClick={() => handleSort("status")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
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
            {paginatedRates.map((rate) => (
              <tr
                key={rate.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                  background: selectedRows.has(rate.id) ? "rgba(37, 99, 235, 0.05)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!selectedRows.has(rate.id)) {
                    e.currentTarget.style.background = "var(--hover-bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedRows.has(rate.id)
                    ? "rgba(37, 99, 235, 0.05)"
                    : "transparent";
                }}
              >
                <td style={{ padding: "12px 16px", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rate.id)}
                    onChange={() => handleSelectRow(rate.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: "pointer" }}
                  />
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", fontWeight: "600" }}
                >
                  {rate.code}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {rate.roomType}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {rate.rateType}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {new Date(rate.effectiveFrom).toLocaleDateString()}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {new Date(rate.effectiveTo).toLocaleDateString()}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{
                    padding: "12px 16px",
                    color: "var(--foreground)",
                    fontSize: "13px",
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  ${rate.basePrice.toFixed(2)}
                </td>
                <td
                  onClick={() => onRowClick?.(rate)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}
                >
                  {rate.channels.join(", ")}
                </td>
                <td onClick={() => onRowClick?.(rate)} style={{ padding: "12px 16px" }}>
                  <RateStatusBadge status={rate.status} />
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    display: "flex",
                    gap: "4px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit?.(rate)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onClone?.(rate)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      color: "#8b5cf6",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Clone
                  </button>
                  <button
                    onClick={() => onHistory?.(rate)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      color: "#2563eb",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    History
                  </button>
                  <button
                    onClick={() => handleDelete(rate.id)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      color: "#dc3545",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
            Page {currentPage} of {totalPages} ({selectedRows.size} selected)
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
    </div>
  );
}
