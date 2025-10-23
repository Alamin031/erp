"use client";

import { useTransactions } from "@/store/useTransactions";
import { useMemo } from "react";
import { ArrowUpRight, TrendingUp, ArrowLeftRight, XCircle } from "lucide-react";

export function TransactionStatsCards() {
  const { getTransactionStats } = useTransactions();

  const stats = useMemo(() => getTransactionStats(), [getTransactionStats]);

  const cards = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toString(),
      subtext: `${stats.totalTransactions} total`,
      icon: <TrendingUp className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Shares Issued",
      value: stats.totalSharesIssued.toLocaleString(),
      subtext: `${stats.issuanceCount} issuances`,
      icon: <ArrowUpRight className="text-green-500" size={24} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Total Exercises Completed",
      value: stats.totalExercisesCompleted.toLocaleString(),
      subtext: `${stats.exerciseCount} exercises`,
      icon: <TrendingUp className="text-purple-500" size={24} />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Pending Transfers",
      value: stats.pendingTransfers.toString(),
      subtext: `${stats.transferCount} total transfers`,
      icon: <ArrowLeftRight className="text-orange-500" size={24} />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg p-6 border ${card.bgColor} ${card.borderColor}`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">{card.title}</h3>
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-xs text-gray-600 mt-2">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
