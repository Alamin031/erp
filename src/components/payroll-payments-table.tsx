"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { PayrollRecord } from "@/types/payroll";

interface PayrollPaymentsTableProps {
  payments: PayrollRecord[];
  onProcessPayroll: () => void;
  onUpdateStatus: (id: string, status: any) => void;
  onExport: (format: "pdf" | "excel") => void;
  filters: {
    status: string;
    month: number;
    year: number;
  };
  onFilterChange: (filters: any) => void;
}

const statusConfig = {
  Paid: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  Pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  Processing: { icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  Failed: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
};

export function PayrollPaymentsTable({
  payments,
  onProcessPayroll,
  onUpdateStatus,
  onExport,
  filters,
  onFilterChange,
}: PayrollPaymentsTableProps) {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredPayments = payments.filter((p) => {
    if (filters.status && p.paymentStatus !== filters.status) return false;
    if (filters.month && p.month !== filters.month) return false;
    if (filters.year && p.year !== filters.year) return false;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(filteredPayments.map((p) => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, id]);
    } else {
      setSelectedPayments(selectedPayments.filter((pid) => pid !== id));
    }
  };

  const handleProcessSelected = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    selectedPayments.forEach((id) => {
      onUpdateStatus(id, "Paid");
    });

    setSelectedPayments([]);
    setIsProcessing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Payment History
          </h3>
          <button
            onClick={onProcessPayroll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Process Payroll
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <select
            value={filters.month}
            onChange={(e) =>
              onFilterChange({ ...filters, month: parseInt(e.target.value) })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(2024, i).toLocaleDateString("en-US", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) =>
              onFilterChange({ ...filters, year: parseInt(e.target.value) })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {selectedPayments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border-b border-blue-200 p-4 flex justify-between items-center"
        >
          <p className="text-sm text-gray-900">
            {selectedPayments.length} payment{selectedPayments.length !== 1 ? "s" : ""} selected
          </p>
          <button
            onClick={handleProcessSelected}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isProcessing ? "Processing..." : "Mark as Paid"}
          </button>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    filteredPayments.length > 0 &&
                    selectedPayments.length === filteredPayments.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Employee
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Period
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                Net Pay
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Payment Date
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Mode
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => {
              const Config = statusConfig[payment.paymentStatus as keyof typeof statusConfig];
              const Icon = Config?.icon || Clock;

              return (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e) =>
                        handleSelectPayment(payment.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {payment.employee?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {payment.period}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${payment.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={Config?.color} />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${Config?.bg}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {payment.paymentMethod || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No payments found
        </div>
      )}

      <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-2">
        <button
          onClick={() => onExport("pdf")}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors"
        >
          <Download size={16} />
          Export PDF
        </button>
        <button
          onClick={() => onExport("excel")}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white transition-colors"
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>
    </motion.div>
  );
}
