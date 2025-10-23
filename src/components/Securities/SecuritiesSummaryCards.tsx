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
      icon: <DollarSign size={24} />,
      iconColor: "var(--primary)",
      bgColor: "rgba(74, 158, 255, 0.05)",
      borderColor: "rgba(74, 158, 255, 0.2)",
    },
    {
      title: "Total Stock Options Granted",
      value: stats.totalOptions.toLocaleString(),
      icon: <Target size={24} />,
      iconColor: "var(--primary)",
      bgColor: "rgba(74, 158, 255, 0.05)",
      borderColor: "rgba(74, 158, 255, 0.2)",
    },
    {
      title: "Active Equity Awards",
      value: stats.activeAwards.toString(),
      icon: <Award size={24} />,
      iconColor: "var(--success)",
      bgColor: "rgba(40, 167, 69, 0.05)",
      borderColor: "rgba(40, 167, 69, 0.2)",
    },
    {
      title: "Current Valuation",
      value: `$${(stats.valuation / 1000000).toFixed(1)}M`,
      icon: <TrendingUp size={24} />,
      iconColor: "var(--warning)",
      bgColor: "rgba(255, 193, 7, 0.05)",
      borderColor: "rgba(255, 193, 7, 0.2)",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px"
    }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            borderRadius: "8px",
            padding: "16px",
            border: `1px solid ${card.borderColor}`,
            background: card.bgColor
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px"
          }}>
            <h3 style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--secondary)",
              margin: 0
            }}>{card.title}</h3>
            <div style={{ color: card.iconColor }}>
              {card.icon}
            </div>
          </div>
          <p style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--primary)",
            margin: 0
          }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
