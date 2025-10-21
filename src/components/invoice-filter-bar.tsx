"use client";

import { useState } from "react";
import { InvoiceFilters } from "@/types/invoice";

interface InvoiceFilterBarProps {
  onFilterChange?: (filters: InvoiceFilters) => void;
}

export function InvoiceFilterBar({ onFilterChange }: InvoiceFilterBarProps) {
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: "",
    clientType: "",
    searchQuery: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (key: keyof InvoiceFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: InvoiceFilters = {
      status: "",
      clientType: "",
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="filters-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Filters & Search
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
          placeholder="Search invoice number, client name, or company..."
          value={filters.searchQuery}
          onChange={e => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={filters.status}
            onChange={e => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Client Type</label>
          <select
            className="form-input"
            value={filters.clientType}
            onChange={e => handleFilterChange("clientType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Guest">Guest</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateFrom}
            onChange={e => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateTo}
            onChange={e => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
