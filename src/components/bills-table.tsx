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
  Paid: { color: "bg-green-100", textColor: "text-green-800", label: "Paid" },
  Pending: { color: "bg-yellow-100", textColor: "text-yellow-800", label: "Pending" },
  Overdue: { color: "bg-red-100", textColor: "text-red-800", label: "Overdue" },
  Cancelled: { color: "bg-gray-100", textColor: "text-gray-800", label: "Cancelled" },
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
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Bills</h3>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={vendorFilter}
            onChange={(e) => handleVendorChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Bill ID
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Vendor
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Due Date
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => {
              const config = statusConfig[bill.status as keyof typeof statusConfig];
              return (
                <tr
                  key={bill.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {bill.billNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{bill.vendorName}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(bill.billDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${bill.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}
                    >
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView(bill)}
                        title="View Details"
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(bill)}
                        title="Edit"
                        className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => onDelete(bill.id)}
                        title="Delete"
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} className="text-red-600" />
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
        <div className="text-center py-12 text-gray-500">
          No bills found
        </div>
      )}
    </motion.div>
  );
}
