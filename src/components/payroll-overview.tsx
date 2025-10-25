"use client";

import { motion } from "framer-motion";
import { BarChart3, Mail, DollarSign } from "lucide-react";
import { PayrollStatsCards } from "./payroll-stats-cards";
import { PayrollTrendChart, DepartmentDistribution } from "./payroll-charts";
import { useToast } from "@/components/toast";

interface PayrollOverviewProps {
  totalEmployees: number;
  pendingPayments: number;
  totalSalaryPaid: number;
  upcomingDeductions: number;
  monthlyTrend: Array<{ month: string; expense: number; paid: number }>;
  departmentStats: Record<string, { count: number; totalSalary: number }>;
  onGeneratePayroll: () => void;
  onSendPayslips: () => void;
  onReviewTaxes: () => void;
}

export function PayrollOverview({
  totalEmployees,
  pendingPayments,
  totalSalaryPaid,
  upcomingDeductions,
  monthlyTrend,
  departmentStats,
  onGeneratePayroll,
  onSendPayslips,
  onReviewTaxes,
}: PayrollOverviewProps) {
  const { showToast } = useToast();

  const departmentData = Object.entries(departmentStats).map(
    ([name, data]) => ({
      name,
      value: data.totalSalary,
    })
  );

  const handleQuickAction = (action: string, callback: () => void) => {
    callback();
    showToast(`${action} initiated successfully`, "success");
  };

  return (
    <div className="space-y-6">
      <PayrollStatsCards
        totalEmployees={totalEmployees}
        pendingPayments={pendingPayments}
        totalSalaryPaid={totalSalaryPaid}
        upcomingDeductions={upcomingDeductions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollTrendChart data={monthlyTrend} />
        <DepartmentDistribution data={departmentData} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickAction("Generate Payroll", onGeneratePayroll)}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <BarChart3 size={20} className="text-blue-600" />
            <span className="font-medium text-gray-900">Generate Payroll</span>
          </button>
          <button
            onClick={() => handleQuickAction("Send Payslips", onSendPayslips)}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Mail size={20} className="text-green-600" />
            <span className="font-medium text-gray-900">Send Payslips</span>
          </button>
          <button
            onClick={() => handleQuickAction("Review Taxes", onReviewTaxes)}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <DollarSign size={20} className="text-purple-600" />
            <span className="font-medium text-gray-900">Review Taxes</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
