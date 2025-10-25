"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface BillsStatsCardsProps {
  totalBills: number;
  totalPaid: number;
  totalPending: number;
  overdueBills: number;
}

export function BillsStatsCards({
  totalBills,
  totalPaid,
  totalPending,
  overdueBills,
}: BillsStatsCardsProps) {
  const cards = [
    {
      label: "Total Bills",
      value: totalBills,
      icon: FileText,
      color: "#6c757d",
      bgColor: "bg-gray-50",
    },
    {
      label: "Paid",
      value: totalPaid,
      icon: CheckCircle,
      color: "#10b981",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending",
      value: totalPending,
      icon: Clock,
      color: "#f59e0b",
      bgColor: "bg-amber-50",
    },
    {
      label: "Overdue",
      value: overdueBills,
      icon: AlertTriangle,
      color: "#ef4444",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-xl shadow-md p-6 ${card.bgColor} border border-gray-200 transition-all hover:shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon size={18} color={card.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
