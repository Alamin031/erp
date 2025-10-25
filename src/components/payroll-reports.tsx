"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, BarChart3, Calendar } from "lucide-react";
import { useToast } from "@/components/toast";

interface PayrollReportsProps {
  onExportReport: (format: "pdf" | "excel", filters: any) => void;
  onPrint: (filters: any) => void;
}

export function PayrollReports({
  onExportReport,
  onPrint,
}: PayrollReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const { showToast } = useToast();

  const departments = ["HR", "Engineering", "Sales", "Finance", "Operations"];
  const statuses = ["Pending", "Paid", "Processing", "Failed"];

  const handleExport = (format: "pdf" | "excel") => {
    onExportReport(format, {
      month: selectedMonth,
      year: selectedYear,
      department: selectedDepartment,
      status: selectedStatus,
    });
    showToast(`Report exported as ${format.toUpperCase()}`, "success");
  };

  const handlePrint = () => {
    onPrint({
      month: selectedMonth,
      year: selectedYear,
      department: selectedDepartment,
      status: selectedStatus,
    });
    showToast("Opening print dialog...", "info");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: 24 }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
            Report Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(2024, i).toLocaleDateString("en-US", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
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

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--secondary)', marginBottom: 8 }}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '100%', padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--background)', color: 'var(--foreground)', outline: 'none', fontSize: '1rem' }}
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              style={{ width: '100%', padding: '8px 16px', background: '#334155', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', fontWeight: 500, fontSize: 16, transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#1e293b')}
              onMouseOut={e => (e.currentTarget.style.background = '#334155')}
            >
              <FileText size={16} />
              Print Report
            </button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', border: '1px solid var(--border)', padding: 24 }}
          >
            <div className="flex items-start gap-4">
              <div style={{ padding: 12, background: 'rgba(59,130,246,0.1)', borderRadius: 12 }}>
                <Download size={24} style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
                  Export as PDF
                </h4>
                <p style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 16 }}>
                  Download a formatted PDF report of payroll data with detailed breakdown
                </p>
                <button
                  onClick={() => handleExport("pdf")}
                  style={{ fontSize: 14, background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
                  onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
                >
                  Export PDF
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', border: '1px solid var(--border)', padding: 24 }}
          >
            <div className="flex items-start gap-4">
              <div style={{ padding: 12, background: 'rgba(34,197,94,0.1)', borderRadius: 12 }}>
                <BarChart3 size={24} style={{ color: '#22c55e' }} />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 8 }}>
                  Export as Excel
                </h4>
                <p style={{ fontSize: 12, color: 'var(--secondary)', marginBottom: 16 }}>
                  Download an Excel spreadsheet with all payroll records for further analysis
                </p>
                <button
                  onClick={() => handleExport("excel")}
                  style={{ fontSize: 14, background: '#22c55e', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', transition: 'background 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.background = '#16a34a')}
                  onMouseOut={e => (e.currentTarget.style.background = '#22c55e')}
                >
                  Export Excel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: 24 }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
          Available Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
            <h4 style={{ fontWeight: 500, color: 'var(--foreground)', marginBottom: 8 }}>Monthly Payroll Summary</h4>
            <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 12 }}>
              Complete breakdown of payroll expenses by employee and department
            </p>
            <button style={{ fontSize: 14, color: '#3b82f6', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              Generate →
            </button>
          </div>

          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
            <h4 style={{ fontWeight: 500, color: 'var(--foreground)', marginBottom: 8 }}>Tax Deduction Report</h4>
            <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 12 }}>
              Detailed tax and deduction calculations for all employees
            </p>
            <button style={{ fontSize: 14, color: '#3b82f6', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              Generate →
            </button>
          </div>

          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
            <h4 style={{ fontWeight: 500, color: 'var(--foreground)', marginBottom: 8 }}>Payment History</h4>
            <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 12 }}>
              Complete payment history with status and transaction details
            </p>
            <button style={{ fontSize: 14, color: '#3b82f6', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              Generate →
            </button>
          </div>

          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
            <h4 style={{ fontWeight: 500, color: 'var(--foreground)', marginBottom: 8 }}>Department Analytics</h4>
            <p style={{ fontSize: 14, color: 'var(--secondary)', marginBottom: 12 }}>
              Salary distribution and expense trends by department
            </p>
            <button style={{ fontSize: 14, color: '#3b82f6', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              Generate →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
