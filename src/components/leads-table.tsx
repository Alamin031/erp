"use client";

import { useState } from "react";
import { Lead, LeadStage } from "@/types/leads";
import { useToast } from "./toast";
import { ChevronUp, ChevronDown, Download } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onScheduleFollowUp?: (lead: Lead) => void;
  onChangeStage?: (leadId: string, newStage: LeadStage) => void;
  onMarkConverted?: (id: string) => void;
  onMarkLost?: (id: string) => void;
}

type SortField = keyof Lead;
type SortOrder = "asc" | "desc";

const stageColors: Record<LeadStage, string> = {
  New: "#6b7280",
  Contacted: "#2563eb",
  Qualified: "#f59e0b",
  Proposal: "#8b5cf6",
  "Closed Won": "#059669",
  "Closed Lost": "#dc3545",
};

export function LeadsTable({
  leads,
  onEdit,
  onView,
  onDelete,
  onScheduleFollowUp,
  onChangeStage,
  onMarkConverted,
  onMarkLost,
}: LeadsTableProps) {
  const { showToast } = useToast();
  const [sortField, setSortField] = useState<SortField>("createdAt");
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

  const sortedLeads = [...leads].sort((a, b) => {
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

  const paginatedLeads = sortedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete?.(id);
      showToast(`${name} deleted`, "success");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Lead ID",
      "Name",
      "Company",
      "Email",
      "Phone",
      "Stage",
      "Assigned To",
      "Value",
      "Status",
      "Next Follow-up",
    ];
    const rows = leads.map((lead) => [
      lead.id,
      lead.name,
      lead.company,
      lead.email,
      lead.phone,
      lead.stage,
      lead.assignedToName,
      `$${lead.potentialValue}`,
      lead.status,
      lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("Leads exported as CSV", "success");
  };

  if (leads.length === 0) {
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
        <p style={{ margin: 0, fontSize: "14px" }}>No leads found.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "1000px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th
                onClick={() => handleSort("id")}
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
                  ID {sortField === "id" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
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
                  Name {sortField === "name" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("company")}
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
                  Company {sortField === "company" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
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
                Email
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "120px",
                }}
              >
                Phone
              </th>
              <th
                onClick={() => handleSort("stage")}
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
                  Stage {sortField === "stage" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("assignedToName")}
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
                  Assigned To {sortField === "assignedToName" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("potentialValue")}
                style={{
                  padding: "12px 16px",
                  textAlign: "right",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  userSelect: "none",
                  minWidth: "100px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                  Value {sortField === "potentialValue" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
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
                  minWidth: "100px",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--secondary)",
                  textTransform: "uppercase",
                  minWidth: "180px",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeads.map((lead) => (
              <tr
                key={lead.id}
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
                <td style={{ padding: "12px 16px", color: "var(--primary)", fontSize: "12px", fontWeight: "600" }}>
                  {lead.id}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", fontWeight: "500" }}>
                  {lead.name}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}>
                  {lead.company}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}>
                  {lead.email}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "12px" }}>
                  {lead.phone}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: `${stageColors[lead.stage]}20`,
                      color: stageColors[lead.stage],
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {lead.stage}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}>
                  {lead.assignedToName}
                </td>
                <td style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}>
                  ${(lead.potentialValue / 1000).toFixed(0)}K
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor:
                        lead.status === "Converted"
                          ? "rgba(5, 150, 105, 0.2)"
                          : lead.status === "Lost"
                            ? "rgba(220, 53, 69, 0.2)"
                            : "rgba(37, 99, 235, 0.2)",
                      color:
                        lead.status === "Converted"
                          ? "#059669"
                          : lead.status === "Lost"
                            ? "#dc3545"
                            : "#2563eb",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {lead.status}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => onView?.(lead)}
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
                    View
                  </button>
                  <button
                    onClick={() => onEdit?.(lead)}
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
                    onClick={() => onScheduleFollowUp?.(lead)}
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
                    Follow-up
                  </button>
                  {lead.status === "Active" && lead.stage !== "Closed Won" && (
                    <button
                      onClick={() => onMarkConverted?.(lead.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        color: "#059669",
                        background: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "6px",
                      }}
                    >
                      Convert
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(lead.id, lead.name)}
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
