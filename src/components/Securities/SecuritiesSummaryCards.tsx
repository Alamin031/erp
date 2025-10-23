"use client";

import { useSecurities } from "@/store/useSecurities";
import { useMemo } from "react";
import { TrendingUp, Award, Target, DollarSign } from "lucide-react";

export function SecuritiesSummaryCards() {
  const { getTotalSharesIssued, getTotalStockOptionsGranted, getActiveEquityAwards, getCurrentValuation } =
    useSecurities();

  const stats = useMemo(
    () => ({
      totalShares: getTotalSharesIssued(),
      totalOptions: getTotalStockOptionsGranted(),
      activeAwards: getActiveEquityAwards(),
      valuation: getCurrentValuation(),
    }),
    [getTotalSharesIssued, getTotalStockOptionsGranted, getActiveEquityAwards, getCurrentValuation]
  );

  const cards = [
    {
      title: "Total Shares Issued",
      value: stats.totalShares.toLocaleString(),
      icon: <DollarSign className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Stock Options Granted",
      value: stats.totalOptions.toLocaleString(),
      icon: <Target className="text-purple-500" size={24} />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Active Equity Awards",
      value: stats.activeAwards.toString(),
      icon: <Award className="text-green-500" size={24} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Current Valuation",
      value: `$${(stats.valuation / 1000000).toFixed(1)}M`,
      icon: <TrendingUp className="text-orange-500" size={24} />,
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
        </div>
      ))}
    </div>
  );
}
