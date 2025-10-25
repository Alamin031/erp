"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AgentPerformance } from "@/store/useReports";

interface Props {
  data: AgentPerformance[];
}

type SortField = keyof AgentPerformance;
type SortOrder = "asc" | "desc";

export function ReportsTable({ data }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("revenue");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const itemsPerPage = 5;

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [data, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIdx, startIdx + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      size={14}
      style={{
        opacity: sortField === field ? 1 : 0.3,
        color: sortField === field ? "var(--primary)" : "var(--secondary)",
      }}
    />
  );

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--secondary)" }}>
        <p>No report data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        borderRadius: 8,
        border: "1px solid var(--border)",
        backgroundColor: "var(--card-bg)",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" }}>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("name")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Agent <SortIcon field="name" />
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("dealsClosedThisMonth")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Deals <SortIcon field="dealsClosedThisMonth" />
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("conversionRate")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Conversion % <SortIcon field="conversionRate" />
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("revenue")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Revenue <SortIcon field="revenue" />
                </div>
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={() => handleSort("forecastAccuracy")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  Forecast Accuracy % <SortIcon field="forecastAccuracy" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((agent, index) => (
              <motion.tr
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 500 }}>
                  {agent.name}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                  {agent.dealsClosedThisMonth}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                  {agent.conversionRate}%
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>
                  ${agent.revenue.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                  {agent.forecastAccuracy}%
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--secondary)" }}>
          Page {currentPage} of {totalPages}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--foreground)",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "12px",
            }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--foreground)",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "12px",
            }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
