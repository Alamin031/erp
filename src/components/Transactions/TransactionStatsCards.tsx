"use client";

import { useTransactions } from "@/store/useTransactions";
import { useMemo } from "react";
import { ArrowUpRight, TrendingUp, ArrowLeftRight } from "lucide-react";

export function TransactionStatsCards() {
  const { getTransactionStats } = useTransactions();

  const stats = useMemo(() => getTransactionStats(), [getTransactionStats]);

  const cards = [
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toString(),
      subtext: `${stats.totalTransactions} total`,
      iconColor: "#2563eb",
      bgColor: "#f0f9ff",
      borderColor: "#bfdbfe",
    },
    {
      title: "Total Shares Issued",
      value: stats.totalSharesIssued.toLocaleString(),
      subtext: `${stats.issuanceCount} issuances`,
      iconColor: "#10b981",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
    },
    {
      title: "Total Exercises Completed",
      value: stats.totalExercisesCompleted.toLocaleString(),
      subtext: `${stats.exerciseCount} exercises`,
      iconColor: "#9333ea",
      bgColor: "#faf5ff",
      borderColor: "#e9d5ff",
    },
    {
      title: "Pending Transfers",
      value: stats.pendingTransfers.toString(),
      subtext: `${stats.transferCount} total transfers`,
      iconColor: "#ea580c",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
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
              {card.title === "Total Transactions" && <TrendingUp size={24} />}
              {card.title === "Total Shares Issued" && <ArrowUpRight size={24} />}
              {card.title === "Total Exercises Completed" && <TrendingUp size={24} />}
              {card.title === "Pending Transfers" && <ArrowLeftRight size={24} />}
            </div>
          </div>
          <p style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--primary)",
            margin: 0
          }}>{card.value}</p>
          <p style={{
            fontSize: "12px",
            color: "var(--secondary)",
            marginTop: "8px",
            margin: 0
          }}>{card.subtext}</p>
        </div>
      ))}
    </div>
  );
}
