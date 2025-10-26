"use client";

import { TrendingUp, DollarSign, BarChart3, Target } from "lucide-react";
import { KPIData } from "@/store/useReports";
import { ReportCard } from "./ReportCard";

interface Props {
  kpiData: KPIData;
}

export function KPIStatsCards({ kpiData }: Props) {
  const cards = [
    { label: "Total Deals", value: kpiData.closedDeals, Icon: TrendingUp, color: "#22c55e", bgColor: "rgba(34,197,94,0.1)" },
    { label: "Total Revenue", value: `$${kpiData.totalSales.toLocaleString()}`, Icon: DollarSign, color: "var(--primary)", bgColor: "rgba(74,158,255,0.1)" },
    { label: "Win Rate %", value: `${kpiData.conversionRate}%`, Icon: BarChart3, color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)" },
    { label: "Forecast Accuracy %", value: `${kpiData.forecastAccuracy}%`, Icon: Target, color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
      {cards.map((c) => (
        <ReportCard key={c.label} label={c.label} value={c.value} Icon={c.Icon as any} color={c.color} bgColor={c.bgColor} />
      ))}
    </div>
  );
}
