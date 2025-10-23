"use client";

import { useTransactions } from "@/store/useTransactions";
import { TransactionFilters } from "@/types/transactions";
import { Search, X } from "lucide-react";

interface Props {
  onFilterChange?: () => void;
}

export function TransactionFiltersBar({ onFilterChange }: Props) {
  const { filters, setFilters, searchTransactions } = useTransactions();

  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
    onFilterChange?.();
  };

  const clearFilters = () => {
    setFilters({ type: "All", status: "All" });
    onFilterChange?.();
  };

  const isFiltered = Object.values(filters).some((v) => v && v !== "All" && v !== "");

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px"
    }}>
      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--secondary)",
          marginBottom: "8px"
        }}>Transaction Type</label>
        <select
          value={filters.type || "All"}
          onChange={(e) => updateFilter("type", e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            fontSize: "13px",
            background: "var(--background)",
            color: "var(--primary)",
            cursor: "pointer"
          }}
        >
          <option value="All">All Types</option>
          <option value="Issuance">Issuance</option>
          <option value="Exercise">Exercise</option>
          <option value="Transfer">Transfer</option>
          <option value="Cancellation">Cancellation</option>
          <option value="Conversion">Conversion</option>
        </select>
      </div>

      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--secondary)",
          marginBottom: "8px"
        }}>Status</label>
        <select
          value={filters.status || "All"}
          onChange={(e) => updateFilter("status", e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            fontSize: "13px",
            background: "var(--background)",
            color: "var(--primary)",
            cursor: "pointer"
          }}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Executed">Executed</option>
        </select>
      </div>

      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--secondary)",
          marginBottom: "8px"
        }}>Entity</label>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--secondary)"
          }} />
          <input
            type="text"
            placeholder="Search shareholder/employee..."
            value={filters.entity || ""}
            onChange={(e) => updateFilter("entity", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--primary)"
            }}
          />
        </div>
      </div>

      <div>
        <label style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          color: "var(--secondary)",
          marginBottom: "8px"
        }}>Transaction Date Range</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--primary)"
            }}
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "13px",
              background: "var(--background)",
              color: "var(--primary)"
            }}
            placeholder="To"
          />
        </div>
      </div>

      {isFiltered && (
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={clearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "var(--background)",
              color: "var(--secondary)",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e5e7eb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--background)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <X size={14} />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
