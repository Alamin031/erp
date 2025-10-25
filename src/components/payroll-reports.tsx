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
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Report Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
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
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download size={24} className="text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Export as PDF
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  Download a formatted PDF report of payroll data with detailed breakdown
                </p>
                <button
                  onClick={() => handleExport("pdf")}
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-100 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 size={24} className="text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Export as Excel
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  Download an Excel spreadsheet with all payroll records for further analysis
                </p>
                <button
                  onClick={() => handleExport("excel")}
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Reports
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Monthly Payroll Summary</h4>
            <p className="text-sm text-gray-600 mb-3">
              Complete breakdown of payroll expenses by employee and department
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Generate →
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Tax Deduction Report</h4>
            <p className="text-sm text-gray-600 mb-3">
              Detailed tax and deduction calculations for all employees
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Generate →
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Payment History</h4>
            <p className="text-sm text-gray-600 mb-3">
              Complete payment history with status and transaction details
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Generate →
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">Department Analytics</h4>
            <p className="text-sm text-gray-600 mb-3">
              Salary distribution and expense trends by department
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Generate →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
