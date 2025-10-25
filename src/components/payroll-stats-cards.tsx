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
      bgColor: "bg-blue-50",
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      icon: Clock,
      color: "#f59e0b",
      bgColor: "bg-amber-50",
    },
    {
      label: "Total Salary Paid (Month)",
      value: `$${totalSalaryPaid.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "#10b981",
      bgColor: "bg-green-50",
    },
    {
      label: "Upcoming Deductions",
      value: `$${upcomingDeductions.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: AlertCircle,
      color: "#ef4444",
      bgColor: "bg-red-50",
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
            className={`rounded-xl shadow-md p-6 ${card.bgColor} border border-gray-100 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon size={20} color={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
