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
  Paid: { icon: CheckCircle, color: "text-green-600", bg: "", style: { background: 'rgba(34,197,94,0.1)', color: '#22c55e' } },
  Pending: { icon: Clock, color: "text-yellow-600", bg: "", style: { background: 'rgba(234,179,8,0.1)', color: '#eab308' } },
  Processing: { icon: Clock, color: "text-blue-600", bg: "", style: { background: 'rgba(59,130,246,0.1)', color: '#3b82f6' } },
  Failed: { icon: AlertCircle, color: "text-red-600", bg: "", style: { background: 'rgba(239,68,68,0.1)', color: '#ef4444' } },
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
      style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', border: '1px solid var(--border)', overflow: 'hidden' }}
    >
  <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)' }}>
            Payment History
          </h3>
          <button
            onClick={onProcessPayroll}
            style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 16, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
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
              style={{ flex: 1, padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: 14 }}
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
            style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: 14 }}
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
            style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: 14 }}
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
          style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <p style={{ fontSize: 14, color: 'var(--foreground)' }}>
            {selectedPayments.length} payment{selectedPayments.length !== 1 ? "s" : ""} selected
          </p>
          <button
            onClick={handleProcessSelected}
            disabled={isProcessing}
            style={{ padding: '8px 16px', background: '#22c55e', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 500, fontSize: 14, opacity: isProcessing ? 0.5 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            onMouseOver={e => { if (!isProcessing) e.currentTarget.style.background = '#16a34a'; }}
            onMouseOut={e => { if (!isProcessing) e.currentTarget.style.background = '#22c55e'; }}
          >
            {isProcessing ? "Processing..." : "Mark as Paid"}
          </button>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table style={{ width: '100%', fontSize: 14 }}>
          <thead style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left' }}>
                <input
                  type="checkbox"
                  checked={
                    filteredPayments.length > 0 &&
                    selectedPayments.length === filteredPayments.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--border)' }}
                />
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>
                Employee
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>
                Period
              </th>
              <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--secondary)' }}>
                Net Pay
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>
                Status
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>
                Payment Date
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: 'var(--secondary)' }}>
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
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  className="hover:bg-[var(--sidebar-hover)]"
                >
                  <td style={{ padding: '16px' }}>
                    <input
                      type="checkbox"
                      checked={selectedPayments.includes(payment.id)}
                      onChange={(e) =>
                        handleSelectPayment(payment.id, e.target.checked)
                      }
                      style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid var(--border)' }}
                    />
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500, color: 'var(--foreground)' }}>
                    {payment.employee?.name || "Unknown"}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--secondary)' }}>
                    {payment.period}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: 'var(--foreground)' }}>
                    ${payment.netPay.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={16} style={{ color: Config?.style?.color }} />
                      <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 12, ...Config?.style }}>{payment.paymentStatus}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--secondary)' }}>
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--secondary)' }}>
                    {payment.paymentMethod || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--secondary)' }}>
          No payments found
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--border)', padding: 16, background: 'var(--background)', display: 'flex', gap: 8 }}>
        <button
          onClick={() => onExport("pdf")}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 14, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', transition: 'background 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
          onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
        >
          <Download size={16} />
          Export PDF
        </button>
        <button
          onClick={() => onExport("excel")}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 14, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', transition: 'background 0.2s' }}
          onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
          onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
        >
          <Download size={16} />
          Export Excel
        </button>
      </div>
    </motion.div>
  );
}
