"use client";

import { useMemo } from "react";
import { Plus, RotateCcw, Search } from "lucide-react";
import { Bill, BillStatus } from "@/types/bills";

interface Props {
  bills: Bill[];
  filters: {
    vendor: string;
    status: BillStatus | "";
    dateFrom: string;
    dateTo: string;
    searchQuery: string;
  };
  onChange: (next: Props["filters"]) => void;
  onUploadClick: () => void;
}

export function BillsFilterBar({ bills, filters, onChange, onUploadClick }: Props) {
  const vendors = useMemo(() => Array.from(new Set(bills.map((b) => b.vendorName))).sort(), [bills]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search Bill No or Vendor..."
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as BillStatus | "" })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={filters.vendor}
          onChange={(e) => onChange({ ...filters, vendor: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Vendors</option>
          {vendors.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => onChange({ vendor: "", status: "", dateFrom: "", dateTo: "", searchQuery: "" })}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RotateCcw size={16} /> Reset
        </button>
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> Upload
        </button>
      </div>
    </div>
  );
}
