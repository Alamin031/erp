"use client";

import { motion } from "framer-motion";
import { Users, Clock, TrendingUp, AlertCircle } from "lucide-react";

interface PayrollStatsCardsProps {
  totalEmployees: number;
  pendingPayments: number;
  totalSalaryPaid: number;
  upcomingDeductions: number;
}

export function PayrollStatsCards({
  totalEmployees,
  pendingPayments,
  totalSalaryPaid,
  upcomingDeductions,
}: PayrollStatsCardsProps) {
  const cards = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "#3b82f6",
  bgColor: "",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      icon: Clock,
      color: "#f59e0b",
  bgColor: "",
    },
    {
      label: "Total Salary Paid (Month)",
      value: `$${totalSalaryPaid.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "#10b981",
  bgColor: "",
    },
    {
      label: "Upcoming Deductions",
      value: `$${upcomingDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: AlertCircle,
      color: "#ef4444",
  bgColor: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ background: 'var(--card-bg)', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.15)', padding: 24, border: '1px solid var(--border)', transition: 'transform 0.2s' }}
            className="hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <p style={{ color: 'var(--secondary)', fontSize: 14, fontWeight: 500 }}>{card.label}</p>
              <div
                style={{ padding: 8, borderRadius: 12, background: `${card.color}20` }}
              >
                <Icon size={20} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--foreground)' }}>{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
