"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, BarChart3, Target, UserCheck } from "lucide-react";
import { KPIData } from "@/store/useReports";

interface Props {
  kpiData: KPIData;
}

export function KPIStatsCards({ kpiData }: Props) {
  const cards = [
    {
      label: "Total Sales",
      value: `$${kpiData.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "var(--primary)",
      bgColor: "rgba(74, 158, 255, 0.1)",
    },
    {
      label: "Closed Deals",
      value: kpiData.closedDeals,
      icon: TrendingUp,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Conversion Rate",
      value: `${kpiData.conversionRate}%`,
      icon: BarChart3,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Forecast Accuracy",
      value: `${kpiData.forecastAccuracy}%`,
      icon: Target,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
    },
    {
      label: "Top Agent",
      value: kpiData.topAgent || "N/A",
      icon: UserCheck,
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.1)",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            style={{
              padding: "20px",
              borderRadius: 12,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: "12px", color: "var(--secondary)", marginBottom: 4, fontWeight: 500 }}>
                  {card.label}
                </p>
              </div>
              <div
                style={{
                  padding: "8px",
                  borderRadius: 8,
                  backgroundColor: card.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={18} style={{ color: card.color }} />
              </div>
            </div>
            <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--foreground)" }}>
              {typeof card.value === "number" ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {card.value}
                </motion.span>
              ) : (
                card.value
              )}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
