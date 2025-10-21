"use client";

import { useState } from "react";
import { Room, RoomFilters } from "@/types/room";

interface RoomFilterBarProps {
  rooms: Room[];
  onFilterChange?: (filters: RoomFilters) => void;
}

export function RoomFilterBar({ rooms, onFilterChange }: RoomFilterBarProps) {
  const [filters, setFilters] = useState<RoomFilters>({
    status: "",
    floor: "",
    roomType: "",
    searchQuery: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (key: keyof RoomFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: RoomFilters = {
      status: "",
      floor: "",
      roomType: "",
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort();
  const roomTypes = Array.from(new Set(rooms.map(r => r.type)));

  return (
    <div className="filters-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
          Filters
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
          placeholder="Search room number or guest name..."
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
            <option value="Clean">Clean</option>
            <option value="Occupied">Occupied</option>
            <option value="Needs Cleaning">Needs Cleaning</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Floor</label>
          <select
            className="form-input"
            value={filters.floor}
            onChange={e => handleFilterChange("floor", e.target.value ? parseInt(e.target.value) : "")}
          >
            <option value="">All Floors</option>
            {floors.map(floor => (
              <option key={floor} value={floor}>
                Floor {floor}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Room Type</label>
          <select
            className="form-input"
            value={filters.roomType}
            onChange={e => handleFilterChange("roomType", e.target.value)}
          >
            <option value="">All Types</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
