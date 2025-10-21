"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaigns";
import { CampaignStatusBadge } from "./campaign-status-badge";
import { useToast } from "./toast";

interface CampaignTableProps {
  campaigns: Campaign[];
  onRowClick?: (campaign: Campaign) => void;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (id: string) => void;
}

type SortField = keyof Campaign;
type SortOrder = "asc" | "desc";

export function CampaignTable({
  campaigns,
  onRowClick,
  onEdit,
  onDelete,
}: CampaignTableProps) {
  const { showToast } = useToast();
  const [sortField, setSortField] = useState<SortField>("startDate");
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

  const sortedCampaigns = [...campaigns].sort((a, b) => {
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

  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      onDelete?.(id);
      showToast("Campaign deleted successfully", "success");
    }
  };

  if (campaigns.length === 0) {
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
          No campaigns found. Create a new campaign to get started.
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
                }}
              >
                Campaign Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("channel")}
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
                Channel {sortField === "channel" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("startDate")}
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
                Start Date {sortField === "startDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("endDate")}
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
                End Date {sortField === "endDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("budget")}
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
                Budget {sortField === "budget" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("ctr")}
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
                CTR % {sortField === "ctr" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("roi")}
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
                ROI % {sortField === "roi" && (sortOrder === "asc" ? "↑" : "↓")}
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
            {paginatedCampaigns.map((campaign) => (
              <tr
                key={campaign.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--hover-bg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", fontWeight: "500" }}
                >
                  {campaign.name}
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {campaign.channel}
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {new Date(campaign.startDate).toLocaleDateString()}
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--secondary)", fontSize: "13px" }}
                >
                  {new Date(campaign.endDate).toLocaleDateString()}
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}
                >
                  ${campaign.budget.toLocaleString()}
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px", color: "var(--foreground)", fontSize: "13px", textAlign: "right", fontWeight: "600" }}
                >
                  {campaign.ctr.toFixed(2)}%
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{
                    padding: "12px 16px",
                    color: campaign.roi > 0 ? "#059669" : "#dc3545",
                    fontSize: "13px",
                    textAlign: "right",
                    fontWeight: "600",
                  }}
                >
                  {campaign.roi > 0 ? "+" : ""}{campaign.roi.toFixed(0)}%
                </td>
                <td
                  onClick={() => onRowClick?.(campaign)}
                  style={{ padding: "12px 16px" }}
                >
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => onEdit?.(campaign)}
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
                    onClick={() => handleDelete(campaign.id)}
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
