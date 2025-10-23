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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Holder Name
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search name..."
              value={filters.holderName || ""}
              onChange={(e) => updateFilter("holderName", e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type || "All"}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="form-input"
          >
            <option value="All">All Types</option>
            <option value="Common">Common</option>
            <option value="Preferred">Preferred</option>
            <option value="Convertible Note">Convertible Note</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || "All"}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="form-input"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Shares
          </label>
          <input
            type="number"
            placeholder="Min shares"
            value={filters.minShares || ""}
            onChange={(e) => updateFilter("minShares", e.target.value ? Number(e.target.value) : undefined)}
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {isFiltered && (
        <button
          onClick={clearFilters}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          <X size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
