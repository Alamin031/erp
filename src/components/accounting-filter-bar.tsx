"use client";

import { useState } from "react";
import { AccountingFilters } from "@/types/accounting";

interface AccountingFilterBarProps {
  onFilterChange?: (filters: AccountingFilters) => void;
}

export function AccountingFilterBar({ onFilterChange }: AccountingFilterBarProps) {
  const [filters, setFilters] = useState<AccountingFilters>({
    dateFrom: "",
    dateTo: "",
    accountType: "",
    clientOrVendor: "",
    status: "",
    minAmount: 0,
    maxAmount: 999999,
    searchQuery: "",
  });

  const handleFilterChange = (key: keyof AccountingFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: AccountingFilters = {
      dateFrom: "",
      dateTo: "",
      accountType: "",
      clientOrVendor: "",
      status: "",
      minAmount: 0,
      maxAmount: 999999,
      searchQuery: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    v => v !== "" && v !== 0 && v !== 999999
  );

  return (
    <div className="filters-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--foreground)",
          }}
        >
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
          placeholder="Search by reference, client, vendor, or description..."
          value={filters.searchQuery}
          onChange={e => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      <div className="filters-row">
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

        <div className="filter-group">
          <label className="form-label">Account Type</label>
          <select
            className="form-input"
            value={filters.accountType}
            onChange={e => handleFilterChange("accountType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
            <option value="Equity">Equity</option>
            <option value="Revenue">Revenue</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={filters.status}
            onChange={e => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Min Amount</label>
          <input
            type="number"
            className="form-input"
            value={filters.minAmount}
            onChange={e => handleFilterChange("minAmount", parseFloat(e.target.value) || 0)}
            min="0"
            step="100"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Max Amount</label>
          <input
            type="number"
            className="form-input"
            value={filters.maxAmount}
            onChange={e => handleFilterChange("maxAmount", parseFloat(e.target.value) || 999999)}
            min="0"
            step="100"
          />
        </div>
      </div>
    </div>
  );
}
