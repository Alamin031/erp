"use client";

import { useState } from "react";
import { RateFilters, RateType, Channel, RateStatus } from "@/types/rates";

interface RatesFilterBarProps {
  onFilterChange?: (filters: RateFilters) => void;
  roomTypes: string[];
}

export function RatesFilterBar({ onFilterChange, roomTypes }: RatesFilterBarProps) {
  const [filters, setFilters] = useState<RateFilters>({
    roomType: [],
    rateType: [],
    channel: [],
    status: [],
    dateFrom: "",
    dateTo: "",
    priceFrom: 0,
    priceTo: 10000,
    searchQuery: "",
  });

  const handleFilterChange = (key: keyof RateFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleArrayFilterChange = (key: keyof RateFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const handleResetFilters = () => {
    const resetFilters: RateFilters = {
      roomType: [],
      rateType: [],
      channel: [],
      status: [],
      dateFrom: "",
      dateTo: "",
      priceFrom: 0,
      priceTo: 10000,
      searchQuery: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => (Array.isArray(v) && v.length > 0) || (typeof v === "string" && v !== "")
  );

  const rateTypes: RateType[] = ["Base", "Seasonal", "Promo", "Corporate", "Package"];
  const channels: Channel[] = ["All", "OTA", "Direct", "Corporate"];
  const statuses: RateStatus[] = ["Active", "Scheduled", "Expired"];

  return (
    <div className="filters-section" style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
          🔍 Filters & Search
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            style={{
              padding: "7px 14px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--primary)",
              background: "transparent",
              border: "1px solid var(--primary)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--primary)";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--primary)";
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔎 Search rate name, code, or room type..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
          style={{ 
            padding: "12px 16px",
            fontSize: "14px",
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
          }}
        />
      </div>

      <div 
        className="filters-row" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(7, 1fr)", 
          gap: "12px",
          alignItems: "start"
        }}
      >
        {/* Room Type */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>Room Type</label>
          <select
            className="form-input"
            multiple
            value={filters.roomType}
            onChange={(e) =>
              handleFilterChange(
                "roomType",
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            style={{ 
              minHeight: "100px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "6px",
              fontSize: "12px"
            }}
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Rate Type */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>Rate Type</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {rateTypes.map((type) => (
              <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.rateType.includes(type)}
                  onChange={() => handleArrayFilterChange("rateType", type)}
                  style={{ cursor: "pointer", width: "14px", height: "14px", flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Channel */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>Channel</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {channels.map((channel) => (
              <label key={channel} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.channel.includes(channel)}
                  onChange={() => handleArrayFilterChange("channel", channel)}
                  style={{ cursor: "pointer", width: "14px", height: "14px", flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>Status</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {statuses.map((status) => (
              <label key={status} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleArrayFilterChange("status", status)}
                  style={{ cursor: "pointer", width: "14px", height: "14px", flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* From Date */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>From Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "12px",
              width: "100%"
            }}
          />
        </div>

        {/* To Date */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>To Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "12px",
              width: "100%"
            }}
          />
        </div>

        {/* Price Range */}
        <div className="filter-group" style={{ background: "var(--background)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border)" }}>
          <label className="form-label" style={{ marginBottom: "10px", fontWeight: "600", fontSize: "13px", display: "block" }}>Price Range</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange("priceFrom", parseFloat(e.target.value) || 0)}
              min="0"
              style={{ 
                width: "100%",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "6px",
                fontSize: "12px"
              }}
            />
            <span style={{ color: "var(--secondary)", fontSize: "10px", fontWeight: "600", textAlign: "center" }}>to</span>
            <input
              type="number"
              className="form-input"
              placeholder="10000"
              value={filters.priceTo}
              onChange={(e) => handleFilterChange("priceTo", parseFloat(e.target.value) || 10000)}
              min="0"
              style={{ 
                width: "100%",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "6px",
                fontSize: "12px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
