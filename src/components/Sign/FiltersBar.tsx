"use client";

import { useSign } from "@/store/useSign";
import { DocumentStatus } from "@/types/document";
import { Search, X } from "lucide-react";

const STATUS_OPTIONS: DocumentStatus[] = [
  "draft",
  "sent",
  "partially_signed",
  "completed",
  "approved",
  "rejected",
  "expired",
];

interface FiltersBarProps {}

export function FiltersBar({}: FiltersBarProps) {
  const { filters, setFilters } = useSign();

  const handleStatusChange = (status: DocumentStatus, checked: boolean) => {
    const statuses = filters.status || [];
    const newStatuses = checked
      ? [...statuses, status]
      : statuses.filter((s) => s !== status);

    setFilters({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = !!(
    filters.status ||
    filters.keyword ||
    filters.owner ||
    filters.recipient
  );

  return (
    <div className="bg-(--card-bg) border-b border-(--border) p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-(--secondary)" />
        <input
          type="text"
          value={filters.keyword || ""}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
          placeholder="Search documents..."
          className="w-full pl-10 pr-3 py-2 border border-(--border) rounded-lg bg-(--background) text-(--foreground) placeholder-(--secondary) focus:outline-none focus:ring-2 focus:ring-(--primary) text-sm"
        />
      </div>

      {/* Status Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-(--secondary) uppercase">
            Status
          </label>
          {filters.status && filters.status.length > 0 && (
            <span className="text-xs text-(--primary)">
              {filters.status.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 px-2 py-1 rounded-lg border border-(--border) cursor-pointer hover:border-(--primary) transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.status?.includes(status) || false}
                onChange={(e) => handleStatusChange(status, e.target.checked)}
                className="w-3 h-3 rounded"
              />
              <span className="text-xs text-(--foreground) capitalize">
                {status.replace(/_/g, " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-(--border) rounded-lg hover:bg-(--background) text-(--secondary) text-sm transition-colors"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
