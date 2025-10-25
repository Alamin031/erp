"use client";

import { useState } from "react";
import { useReports, CRMReportFilters } from "@/store/useReports";
import { Filter, X } from "lucide-react";

const AGENTS = ["Sarah Johnson", "Michael Chen", "Emily Rodriguez", "James Wilson", "Lisa Anderson", "David Martinez"];
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"];
const REPORT_TYPES = [
  { value: "all", label: "All Reports" },
  { value: "sales", label: "Sales" },
  { value: "pipeline", label: "Pipeline" },
  { value: "forecast", label: "Forecast" },
];

interface Props {
  onFiltersApplied?: () => void;
}

export function ReportFilterBar({ onFiltersApplied }: Props) {
  const { filters, setFilters, resetFilters, fetchReportData } = useReports();
  const [localFilters, setLocalFilters] = useState<CRMReportFilters>(filters);

  const handleApply = async () => {
    setFilters(localFilters);
    await fetchReportData();
    onFiltersApplied?.();
  };

  const handleReset = async () => {
    setLocalFilters(filters);
    resetFilters();
    await fetchReportData();
  };

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: 8,
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border)",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Filter size={16} style={{ color: "var(--primary)" }} />
        <h3 style={{ fontWeight: 600, fontSize: "14px" }}>Filters</h3>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        {/* Date From */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>
            Date From
          </label>
          <input
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Date To */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>
            Date To
          </label>
          <input
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Agent */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>
            Agent
          </label>
          <select
            value={localFilters.agent}
            onChange={(e) => setLocalFilters({ ...localFilters, agent: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="">All Agents</option>
            {AGENTS.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>
            Region
          </label>
          <select
            value={localFilters.region}
            onChange={(e) => setLocalFilters({ ...localFilters, region: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            <option value="">All Regions</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Report Type */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 500, marginBottom: 4, display: "block", color: "var(--secondary)" }}>
            Report Type
          </label>
          <select
            value={localFilters.reportType}
            onChange={(e) => setLocalFilters({ ...localFilters, reportType: e.target.value as any })}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {REPORT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          onClick={handleReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            backgroundColor: "transparent",
            color: "var(--foreground)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <X size={14} />
          Reset
        </button>
        <button
          onClick={handleApply}
          disabled={!hasChanges}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: "none",
            backgroundColor: hasChanges ? "var(--primary)" : "var(--border)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            cursor: hasChanges ? "pointer" : "not-allowed",
            transition: "background-color 0.2s",
            opacity: hasChanges ? 1 : 0.5,
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
