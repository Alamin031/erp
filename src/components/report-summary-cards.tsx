"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ReportSummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingBalance: number;
}

function CountUpValue({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += stepValue;
      step++;
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
    </span>
  );
}

export function ReportSummaryCards({
  totalRevenue,
  totalExpenses,
  netProfit,
  outstandingBalance,
}: ReportSummaryCardsProps) {
  const cards = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      icon: "💰",
      color: "#28a745",
      bgColor: "#28a74510",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      icon: "💸",
      color: "#dc3545",
      bgColor: "#dc354510",
    },
    {
      label: "Net Profit",
      value: netProfit,
      icon: "📈",
      color: netProfit >= 0 ? "#28a745" : "#dc3545",
      bgColor: netProfit >= 0 ? "#28a74510" : "#dc354510",
    },
    {
      label: "Outstanding Balance",
      value: outstandingBalance,
      icon: "📊",
      color: "#0066cc",
      bgColor: "#0066cc10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div
          key={card.label}
          variants={itemVariants}
          style={{
            background: card.bgColor,
            borderRadius: "12px",
            padding: "20px",
            border: `2px solid ${card.color}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--secondary)", fontWeight: "600" }}>
                {card.label}
              </span>
              <span style={{ fontSize: "24px" }}>{card.icon}</span>
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: card.color,
                marginBottom: "8px",
              }}
            >
              <CountUpValue value={card.value} prefix="$" />
            </div>

            <div style={{ fontSize: "12px", color: "var(--secondary)" }}>
              {card.value > 0 ? "↑ Updated today" : "No data"}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
