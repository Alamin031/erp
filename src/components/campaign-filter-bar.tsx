"use client";

import { useState } from "react";
import { CampaignFilters, CampaignChannel, CampaignStatus } from "@/types/campaigns";

interface CampaignFilterBarProps {
  onFilterChange?: (filters: CampaignFilters) => void;
}

export function CampaignFilterBar({ onFilterChange }: CampaignFilterBarProps) {
  const [filters, setFilters] = useState<CampaignFilters>({
    status: "",
    channel: "",
    searchQuery: "",
    dateFrom: "",
    dateTo: "",
    roiFrom: 0,
    roiTo: 500,
  });

  const handleFilterChange = (key: keyof CampaignFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: CampaignFilters = {
      status: "",
      channel: "",
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
      roiFrom: 0,
      roiTo: 500,
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => (typeof v === "string" && v !== "") || (typeof v === "number" && v > 0 && v < 500)
  );

  return (
    <div className="filters-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Search & Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "500",
              color: "var(--primary)",
              background: "transparent",
              border: "1px solid var(--primary)",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="search-bar" style={{ marginBottom: "16px" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by campaign name, channel, or description..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "16px",
        alignItems: "end"
      }}>
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value as CampaignStatus | "")}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Channel</label>
          <select
            className="form-input"
            value={filters.channel}
            onChange={(e) => handleFilterChange("channel", e.target.value as CampaignChannel | "")}
          >
            <option value="">All Channels</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="Email">Email</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">ROI Range</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={filters.roiFrom}
              onChange={(e) => handleFilterChange("roiFrom", parseFloat(e.target.value) || 0)}
              min="0"
              style={{ width: "70px" }}
            />
            <span style={{ color: "var(--secondary)", fontSize: "12px", flexShrink: 0 }}>to</span>
            <input
              type="number"
              className="form-input"
              placeholder="500"
              value={filters.roiTo}
              onChange={(e) => handleFilterChange("roiTo", parseFloat(e.target.value) || 500)}
              min="0"
              style={{ width: "70px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
