"use client";

import { useState } from "react";
import { Shareholder } from "@/types/cap-table";
import { useToast } from "./toast";
import { ChevronUp, ChevronDown, Download, RotateCcw } from "lucide-react";

interface ShareholdersTableProps {
  shareholders: Shareholder[];
  onEdit?: (shareholder: Shareholder) => void;
  onDelete?: (id: string) => void;
  onRecalculate?: () => void;
}

type SortField = keyof Shareholder;
type SortOrder = "asc" | "desc";

const equityColors: Record<string, string> = {
  Common: "#2563eb",
  Preferred: "#059669",
  Options: "#f59e0b",
  Convertible: "#8b5cf6",
};

export function ShareholdersTable({
  shareholders,
  onEdit,
  onDelete,
  onRecalculate,
}: ShareholdersTableProps) {
  const { showToast } = useToast();
  const [sortField, setSortField] = useState<SortField>("ownershipPercentage");
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

  const sortedShareholders = [...shareholders].sort((a, b) => {
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

  const paginatedShareholders = sortedShareholders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(shareholders.length / itemsPerPage);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from shareholders?`)) {
      onDelete?.(id);
      showToast(`${name} removed from shareholders`, "success");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Shares Held", "Ownership %", "Equity Type", "Join Date"];
    const rows = shareholders.map((sh) => [
      sh.name,
      sh.email || "",
      sh.sharesHeld,
      sh.ownershipPercentage.toFixed(2),
      sh.equityType,
      new Date(sh.joinDate).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cap-table-shareholders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Shareholders exported as CSV", "success");
  };

  if (shareholders.length === 0) {
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
          No shareholders found. Add a shareholder to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px" }}>
        <button
          onClick={handleExportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "500",
            color: "var(--primary)",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <Download size={14} />
          Export CSV
        </button>
        <button
          onClick={() => {
            onRecalculate?.();
            showToast("Ownership recalculated", "success");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "500",
            color: "var(--primary)",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={14} />
          Recalculate Ownership
        </button>
      </div>

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
                  minWidth: "150px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Name {sortField === "name" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("email")}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "180px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  Email {sortField === "email" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("sharesHeld")}
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "120px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  Shares Held {sortField === "sharesHeld" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("ownershipPercentage")}
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
                  Ownership % {sortField === "ownershipPercentage" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("equityType")}
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
                  Equity Type {sortField === "equityType" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("joinDate")}
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
                  Join Date {sortField === "joinDate" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
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
                  minWidth: "120px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedShareholders.map((shareholder) => (
              <tr
                key={shareholder.id}
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
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", fontWeight: "500" }}>
                  {shareholder.name}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}>
                  {shareholder.email || "-"}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}>
                  {shareholder.sharesHeld.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}>
                  {shareholder.ownershipPercentage.toFixed(2)}%
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: `${equityColors[shareholder.equityType] || "#6b7280"}20`,
                      color: equityColors[shareholder.equityType] || "#6b7280",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {shareholder.equityType}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}>
                  {new Date(shareholder.joinDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => onEdit?.(shareholder)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "11px",
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "6px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shareholder.id, shareholder.name)}
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
    </div>
  );
}
