"use client";

import { useMemo } from "react";
import { TrendingUp, Award, Target, Briefcase, DollarSign } from "lucide-react";
import { useSecurities } from "@/store/useSecurities";

/**
 * Renders a set of summary cards for key securities metrics.
 * Updated with a modern, clean, dark-mode friendly design using vibrant accents.
 */
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
      icon: <Briefcase size={20} className="stroke-[2.5]" />, // Using Briefcase for stock/capital
      color: "blue",
      description: "Outstanding company shares",
    },
    {
      title: "Stock Options Granted",
      value: stats.totalOptions.toLocaleString(),
      icon: <Target size={20} className="stroke-[2.5]" />,
      color: "purple",
      description: "Total options issued to date",
    },
    {
      title: "Active Equity Awards",
      value: stats.activeAwards.toString(),
      icon: <Award size={20} className="stroke-[2.5]" />,
      color: "green",
      description: "Currently vesting or unvested awards",
    },
    {
      title: "Current Valuation",
      // Format valuation to $X.X M
      value: `$${(stats.valuation / 1000000).toFixed(1)}M`,
      icon: <DollarSign size={20} className="stroke-[2.5]" />,
      color: "orange",
      description: "Estimated total company value",
    },
  ];

  /** Helper to get the primary accent color class for text and icons */
  const getAccentColorClass = (color: string) => {
    const map: { [key: string]: string } = {
      blue: "text-blue-400",
      purple: "text-purple-400",
      green: "text-emerald-400", // Using emerald for a fresher green
      orange: "text-orange-400",
    };
    return map[color] || map.blue;
  };

  /** Helper to get the subtle background for the icon container */
  const getIconBgClass = (color: string) => {
    const map: { [key: string]: string } = {
      blue: "bg-blue-900/50",
      purple: "bg-purple-900/50",
      green: "bg-emerald-900/50",
      orange: "bg-orange-900/50",
    };
    return map[color] || map.blue;
  };

  /** Helper to get a strong, colored shadow on hover */
  const getHoverEffectClass = (color: string) => {
    const map: { [key: string]: string } = {
      // Custom shadow colors derived from Tailwind palette for consistency
      blue: "hover:shadow-blue-500/30",
      purple: "hover:shadow-purple-500/30",
      green: "hover:shadow-emerald-500/30",
      orange: "hover:shadow-orange-500/30",
    };
    return map[color] || map.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 font-inter bg-slate-900">
      {cards.map((card, index) => (
        <div
          key={index}
          // Base Card Style: Dark, rounded, subtle border
          className={`p-6 rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 transition-all duration-300 transform cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${getHoverEffectClass(card.color)}`}
        >
          {/* Top Section: Title and Icon */}
          <div className="flex justify-between items-start gap-4">
            <p className="text-sm font-semibold text-slate-400 tracking-wider uppercase">
              {card.title}
            </p>
            {/* Icon Container: Subtle background, vibrant icon color */}
            <div className={`p-3 rounded-full ${getIconBgClass(card.color)} ${getAccentColorClass(card.color)}`}>
              {card.icon}
            </div>
          </div>
          
          {/* Bottom Section: Value and Description */}
          <div className="mt-6">
            {/* Value: Large, bold, and accented */}
            <p className={`text-4xl lg:text-5xl font-extrabold text-white ${getAccentColorClass(card.color)}`}>
              {card.value}
            </p>
            {/* Description: Subtle, smaller text */}
            <p className="mt-2 text-sm text-slate-500">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SecuritiesSummaryCards;
