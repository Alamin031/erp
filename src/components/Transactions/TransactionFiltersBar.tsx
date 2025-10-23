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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
          <select
            value={filters.type || "All"}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="form-input"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || "All"}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="form-input"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Executed">Executed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search shareholder/employee..."
              value={filters.entity || ""}
              onChange={(e) => updateFilter("entity", e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="form-input flex-1"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="form-input flex-1"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      {isFiltered && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          <X size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
}
