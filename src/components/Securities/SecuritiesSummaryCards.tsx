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
      icon: <DollarSign className="text-white" size={28} />,
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
      borderColor: "border-blue-700",
    },
    {
      title: "Total Stock Options Granted",
      value: stats.totalOptions.toLocaleString(),
      icon: <Target className="text-white" size={28} />,
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
      borderColor: "border-purple-700",
    },
    {
      title: "Active Equity Awards",
      value: stats.activeAwards.toString(),
      icon: <Award className="text-white" size={28} />,
      bgColor: "bg-gradient-to-br from-green-600 to-green-700",
      borderColor: "border-green-700",
    },
    {
      title: "Current Valuation",
      value: `$${(stats.valuation / 1000000).toFixed(1)}M`,
      icon: <TrendingUp className="text-white" size={28} />,
      bgColor: "bg-gradient-to-br from-orange-600 to-orange-700",
      borderColor: "border-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg p-6 border ${card.bgColor} ${card.borderColor} shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white opacity-90">{card.title}</h3>
            <div className="flex-shrink-0">
              {card.icon}
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
