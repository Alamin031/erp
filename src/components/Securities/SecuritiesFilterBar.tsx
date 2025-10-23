"use client";

import { useSecurities } from "@/store/useSecurities";
import { SecuritiesFilter } from "@/types/securities";
import { Search, X } from "lucide-react";

interface Props {
  onFilterChange?: () => void;
}

export function SecuritiesFilterBar({ onFilterChange }: Props) {
  const { filters, setFilters } = useSecurities();

  const updateFilter = (key: keyof SecuritiesFilter, value: any) => {
    setFilters({ ...filters, [key]: value });
    onFilterChange?.();
  };

  const clearFilters = () => {
    setFilters({ type: "All", status: "All" });
    onFilterChange?.();
  };

  const isFiltered = Object.values(filters).some(
    (v) => v && v !== "All" && v !== ""
  );

  return (
    <div style={{ display: "contents" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px"
      }}>
        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--secondary)",
            marginBottom: "6px"
          }}>
            Holder Name
          </label>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{
              position: "absolute",
              left: "10px",
              top: "10px",
              color: "var(--secondary)"
            }} />
            <input
              type="text"
              placeholder="Search name..."
              value={filters.holderName || ""}
              onChange={(e) => updateFilter("holderName", e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "32px",
                paddingRight: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "13px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--primary)",
                boxSizing: "border-box"
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
            marginBottom: "6px"
          }}>
            Type
          </label>
          <select
            value={filters.type || "All"}
            onChange={(e) => updateFilter("type", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--primary)",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            <option value="All">All Types</option>
            <option value="Common">Common</option>
            <option value="Preferred">Preferred</option>
            <option value="Convertible Note">Convertible Note</option>
          </select>
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--secondary)",
            marginBottom: "6px"
          }}>
            Status
          </label>
          <select
            value={filters.status || "All"}
            onChange={(e) => updateFilter("status", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--primary)",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            <option value="All">All Status</option>
            <option value="Issued">Issued</option>
            <option value="Active">Active</option>
            <option value="Vested">Vested</option>
            <option value="Transferred">Transferred</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--secondary)",
            marginBottom: "6px"
          }}>
            Minimum Shares
          </label>
          <input
            type="number"
            placeholder="Min shares"
            value={filters.minShares || ""}
            onChange={(e) => updateFilter("minShares", e.target.value ? Number(e.target.value) : undefined)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--primary)",
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
        marginTop: "12px"
      }}>
        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--secondary)",
            marginBottom: "6px"
          }}>
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--primary)",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--secondary)",
            marginBottom: "6px"
          }}>
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              background: "var(--background)",
              color: "var(--primary)",
              boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      {isFiltered && (
        <button
          onClick={clearFilters}
          style={{
            marginTop: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "var(--background)",
            color: "var(--secondary)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            transition: "all 0.2s"
          }}
        >
          <X size={14} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
