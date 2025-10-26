"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Edit2, Trash2, Search, Filter } from "lucide-react";
import { Bill, BillStatus } from "@/types/bills";

interface BillsTableProps {
  bills: Bill[];
  onView: (bill: Bill) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (id: string) => void;
  filters: {
    vendor: string;
    status: BillStatus | "";
  };
  onFilterChange: (filters: any) => void;
}

const statusConfig = {
  Paid: { color: "bg-green-900/30", textColor: "text-green-300", label: "Paid" },
  Pending: { color: "bg-yellow-900/30", textColor: "text-yellow-200", label: "Pending" },
  Overdue: { color: "bg-red-900/30", textColor: "text-red-300", label: "Overdue" },
  Cancelled: { color: "bg-gray-700/50", textColor: "text-gray-300", label: "Cancelled" },
};

export function BillsTable({
  bills,
  onView,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
}: BillsTableProps) {
  const [searchInput, setSearchInput] = useState("");
  const [vendorFilter, setVendorFilter] = useState(filters.vendor || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");

  const vendors = [...new Set(bills.map((b) => b.vendorName))];

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
      bill.vendorName.toLowerCase().includes(searchInput.toLowerCase());
    const matchesVendor = !vendorFilter || bill.vendorName === vendorFilter;
    const matchesStatus = !statusFilter || bill.status === statusFilter;
    return matchesSearch && matchesVendor && matchesStatus;
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(filteredBills.length / pageSize));
  const start = (page - 1) * pageSize;
  const paginated = filteredBills.slice(start, start + pageSize);

  const handleSearch = (query: string) => {
    setSearchInput(query);
    onFilterChange({ ...filters, searchQuery: query });
  };

  const handleVendorChange = (vendor: string) => {
    setVendorFilter(vendor);
    onFilterChange({ ...filters, vendor });
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    onFilterChange({ ...filters, status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl shadow-xl border border-gray-700 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">All Bills</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search bill number or vendor..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <select
            value={vendorFilter}
            onChange={(e) => handleVendorChange(e.target.value)}
            className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm rounded-2xl overflow-hidden">
          <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-300">Bill ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300">Vendor</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300">Date</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300">Due Date</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-300">Amount</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((bill, idx) => {
              const config = statusConfig[bill.status as keyof typeof statusConfig];
              return (
                <tr
                  key={bill.id}
                  className={`border-b border-gray-800 transition-colors ${idx % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/60'} hover:bg-blue-950/30`}
                >
                  <td className="px-6 py-4 text-gray-100 font-medium">{bill.billNumber}</td>
                  <td className="px-6 py-4 text-gray-200">{bill.vendorName}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(bill.billDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(bill.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-100">${bill.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${config.color} ${config.textColor} border border-opacity-30 border-current`}>{config.label}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView(bill)}
                        title="View Details"
                        className="p-2 hover:bg-blue-900/40 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Eye size={16} className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => onEdit(bill)}
                        title="Edit"
                        className="p-2 hover:bg-yellow-900/40 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <Edit2 size={16} className="text-yellow-300" />
                      </button>
                      <button
                        onClick={() => onDelete(bill.id)}
                        title="Delete"
                        className="p-2 hover:bg-red-900/40 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredBills.length === 0 && (
        <div className="text-center py-12 text-gray-500">No bills found</div>
      )}

      {filteredBills.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-gray-700 bg-gray-900/80">
          <div className="text-sm text-gray-400">Page {page} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-600 text-gray-200 rounded bg-gray-800 hover:bg-gray-700 transition-colors" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <button className="px-3 py-1 border border-gray-600 text-gray-200 rounded bg-gray-800 hover:bg-gray-700 transition-colors" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            <select className="ml-2 px-2 py-1 border border-gray-600 text-gray-200 rounded bg-gray-800" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[10, 20, 50].map((s) => (<option key={s} value={s}>{s}/page</option>))}
            </select>
          </div>
        </div>
      )}
    </motion.div>
  );
}
