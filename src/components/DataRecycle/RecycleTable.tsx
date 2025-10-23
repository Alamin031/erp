"use client";

import { useState, useEffect, useRef } from "react";
import { RecycledRecord } from "@/types/recycle";
import { useRecycleBin } from "@/store/useRecycleBin";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Trash2,
  Archive,
  RotateCcw,
} from "lucide-react";

const MODULE_ICONS: Record<string, string> = {
  Reservation: "🏨",
  Invoice: "📄",
  User: "👤",
  Room: "🏠",
  Task: "✓",
  Equipment: "⚙️",
  Guest: "👥",
  Campaign: "📢",
  WorkOrder: "🔧",
  Payment: "💳",
};

interface RecycleTableProps {
  onSelectRecord: (record: RecycledRecord) => void;
}

export function RecycleTable({ onSelectRecord }: RecycleTableProps) {
  const {
    getPagedRecords,
    getFilteredRecords,
    selectedRecordIds,
    toggleRecordSelection,
    selectAll,
    clearSelection,
    sort,
    setSort,
    pagination,
    setPagination,
  } = useRecycleBin();

  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const pagedRecords = getPagedRecords();
  const filteredRecords = getFilteredRecords();
  const totalPages =
    Math.ceil(filteredRecords.length / pagination.pageSize) || 1;

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      selectedRecordIds.length > 0 &&
      selectedRecordIds.length < pagedRecords.length;
  }, [selectedRecordIds, pagedRecords.length]);

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const handleSort = (sortBy: "deletedAt" | "title" | "module") => {
    const newOrder =
      sort.sortBy === sortBy && sort.sortOrder === "desc" ? "asc" : "desc";
    setSort(sortBy, newOrder);
  };

  const handleSelectAll = () => {
    if (selectedRecordIds.length === pagedRecords.length) {
      clearSelection();
    } else {
      selectAll(pagedRecords.map((r) => r.id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRetentionBadge = (status: string) => {
    switch (status) {
      case "eligible_for_purge":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Eligible for Purge
          </span>
        );
      case "protected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Protected
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const SortIcon = ({
    column,
  }: {
    column: "deletedAt" | "title" | "module";
  }) => {
    if (sort.sortBy !== column) return <ChevronsUpDown className="w-4 h-4" />;
    return sort.sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="flex flex-col h-full bg-(--card-bg) rounded-lg border border-(--border)">
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse">
          <thead className="bg-(--background) border-b border-(--border)">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={
                    pagedRecords.length > 0 &&
                    selectedRecordIds.length === pagedRecords.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border border-(--border) cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                Record ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                <button
                  onClick={() => handleSort("module")}
                  className="flex items-center gap-2 hover:text-(--primary)"
                >
                  Module
                  <SortIcon column="module" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                <button
                  onClick={() => handleSort("title")}
                  className="flex items-center gap-2 hover:text-(--primary)"
                >
                  Title / Name
                  <SortIcon column="title" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                Deleted By
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                <button
                  onClick={() => handleSort("deletedAt")}
                  className="flex items-center gap-2 hover:text-(--primary)"
                >
                  Deleted At
                  <SortIcon column="deletedAt" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                Retention Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-(--foreground)">
                Storage
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-(--foreground)">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-(--secondary)"
                >
                  No records found
                </td>
              </tr>
            ) : (
              pagedRecords.map((record) => (
                <tr
                  key={record.id}
                  onMouseEnter={() => setHoveredRow(record.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`border-b border-(--border) hover:bg-(--background) transition-colors ${
                    selectedRecordIds.includes(record.id)
                      ? "bg-(--primary)/5"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecordIds.includes(record.id)}
                      onChange={() => toggleRecordSelection(record.id)}
                      className="rounded border border-(--border) cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-(--foreground)">
                    {record.recordId}
                  </td>
                  <td className="px-4 py-3">
                    <span title={record.module} className="text-lg">
                      {MODULE_ICONS[record.module] || "📦"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelectRecord(record)}
                      className="text-sm text-(--primary) hover:underline font-medium truncate max-w-xs"
                      title={record.title}
                    >
                      {record.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-(--secondary)">
                    {record.deletedBy}
                  </td>
                  <td className="px-4 py-3 text-sm text-(--secondary)">
                    {formatDate(record.deletedAt)}
                  </td>
                  <td className="px-4 py-3">
                    {getRetentionBadge(record.retentionStatus)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-(--background) text-(--foreground)">
                      {record.currentStorage === "archived"
                        ? "📦 Archived"
                        : "💾 Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {hoveredRow === record.id && (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Restore"
                          className="p-1.5 hover:bg-green-100 text-green-700 rounded transition-colors"
                          onClick={() => onSelectRecord(record)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          title="Archive"
                          className="p-1.5 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                          onClick={() => onSelectRecord(record)}
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete"
                          className="p-1.5 hover:bg-red-100 text-red-700 rounded transition-colors"
                          onClick={() => onSelectRecord(record)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredRecords.length > 0 && (
        <div className="border-t border-(--border) px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-(--secondary)">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.page * pagination.pageSize,
              filteredRecords.length
            )}{" "}
            of {filteredRecords.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination(pagination.page - 1, pagination.pageSize)
              }
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded border border-(--border) text-sm disabled:opacity-50 hover:bg-(--background)"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 px-3">
              <span className="text-sm text-(--secondary)">
                Page {pagination.page} of {totalPages}
              </span>
            </div>
            <button
              onClick={() =>
                setPagination(pagination.page + 1, pagination.pageSize)
              }
              disabled={pagination.page >= totalPages}
              className="px-3 py-1 rounded border border-(--border) text-sm disabled:opacity-50 hover:bg-(--background)"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
