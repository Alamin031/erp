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
    <div className="filters-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
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
          placeholder="Search rate name, code, or room type..."
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
        />
      </div>

      <div className="filters-row">
        <div className="filter-group">
          <label className="form-label">Room Type</label>
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
            style={{ minHeight: "80px" }}
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Rate Type</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {rateTypes.map((type) => (
              <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.rateType.includes(type)}
                  onChange={() => handleArrayFilterChange("rateType", type)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "var(--foreground)" }}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="form-label">Channel</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {channels.map((channel) => (
              <label key={channel} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.channel.includes(channel)}
                  onChange={() => handleArrayFilterChange("channel", channel)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "var(--foreground)" }}>{channel}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="form-label">Status</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {statuses.map((status) => (
              <label key={status} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleArrayFilterChange("status", status)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{ fontSize: "13px", color: "var(--foreground)" }}>{status}</span>
              </label>
            ))}
          </div>
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
          <label className="form-label">Price Range</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <input
              type="number"
              className="form-input"
              placeholder="Min"
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange("priceFrom", parseFloat(e.target.value) || 0)}
              min="0"
              style={{ flex: 1 }}
            />
            <span style={{ color: "var(--secondary)" }}>to</span>
            <input
              type="number"
              className="form-input"
              placeholder="Max"
              value={filters.priceTo}
              onChange={(e) => handleFilterChange("priceTo", parseFloat(e.target.value) || 10000)}
              min="0"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
