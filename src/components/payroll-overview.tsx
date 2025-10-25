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
        style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', padding: 24, border: '1px solid var(--border)' }}
      >
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: 16 }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickAction("Generate Payroll", onGeneratePayroll)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--background)', borderRadius: 12, transition: 'background 0.2s', color: 'var(--foreground)', fontWeight: 500, border: '1px solid var(--border)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
          >
            <BarChart3 size={20} style={{ color: '#3b82f6' }} />
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>Generate Payroll</span>
          </button>
          <button
            onClick={() => handleQuickAction("Send Payslips", onSendPayslips)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--background)', borderRadius: 12, transition: 'background 0.2s', color: 'var(--foreground)', fontWeight: 500, border: '1px solid var(--border)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
          >
            <Mail size={20} style={{ color: '#22c55e' }} />
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>Send Payslips</span>
          </button>
          <button
            onClick={() => handleQuickAction("Review Taxes", onReviewTaxes)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--background)', borderRadius: 12, transition: 'background 0.2s', color: 'var(--foreground)', fontWeight: 500, border: '1px solid var(--border)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--sidebar-hover)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--background)')}
          >
            <DollarSign size={20} style={{ color: '#a21caf' }} />
            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>Review Taxes</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
