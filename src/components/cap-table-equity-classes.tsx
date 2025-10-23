"use client";

import { useState } from "react";
import { EquityClass } from "@/types/cap-table";
import { useToast } from "./toast";
import { ChevronUp, ChevronDown } from "lucide-react";

interface EquityClassesTableProps {
  equityClasses: EquityClass[];
  onEdit?: (equityClass: EquityClass) => void;
}

type SortField = keyof EquityClass;
type SortOrder = "asc" | "desc";

const equityColors: Record<string, string> = {
  Common: "#2563eb",
  Preferred: "#059669",
  Options: "#f59e0b",
  Convertible: "#8b5cf6",
};

export function EquityClassesTable({
  equityClasses,
  onEdit,
}: EquityClassesTableProps) {
  const { showToast } = useToast();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedEquityClasses = [...equityClasses].sort((a, b) => {
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

  const getTotalIssued = () => equityClasses.reduce((sum, ec) => sum + ec.issuedShares, 0);
  const getTotalAuthorized = () => equityClasses.reduce((sum, ec) => sum + ec.authorizedShares, 0);
  const totalAuthorized = getTotalAuthorized();
  const totalIssued = getTotalIssued();

  if (equityClasses.length === 0) {
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
          No equity classes found.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th
                onClick={() => handleSort("name")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "120px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Class {sortField === "name" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("authorizedShares")}
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "130px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  Authorized {sortField === "authorizedShares" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("issuedShares")}
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "110px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  Issued {sortField === "issuedShares" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "110px",
                }}
              >
                Remaining
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "110px",
                }}
              >
                % of Total
              </th>
              <th
                onClick={() => handleSort("lastUpdated")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "130px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Last Updated {sortField === "lastUpdated" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "100px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedEquityClasses.map((equityClass) => {
              const remaining = equityClass.authorizedShares - equityClass.issuedShares;
              const percentOfTotal = totalIssued > 0 ? (equityClass.issuedShares / totalIssued) * 100 : 0;

              return (
                <tr
                  key={equityClass.id}
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
                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        backgroundColor: `${equityColors[equityClass.name] || "#6b7280"}20`,
                        color: equityColors[equityClass.name] || "#6b7280",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {equityClass.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}>
                    {equityClass.authorizedShares.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}>
                    {equityClass.issuedShares.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px", textAlign: "right" }}>
                    {remaining.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      color: "var(--foreground)",
                      fontSize: "13px",
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    {percentOfTotal.toFixed(1)}%
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}>
                    {new Date(equityClass.lastUpdated).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <button
                      onClick={() => onEdit?.(equityClass)}
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {equityClasses.length > 0 && (
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--background)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "var(--secondary)", fontSize: "12px" }}>Total Authorized</span>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                {totalAuthorized.toLocaleString()}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--secondary)", fontSize: "12px" }}>Total Issued</span>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                {totalIssued.toLocaleString()}
              </div>
            </div>
            <div>
              <span style={{ color: "var(--secondary)", fontSize: "12px" }}>Total Remaining</span>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", marginTop: "4px" }}>
                {(totalAuthorized - totalIssued).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
