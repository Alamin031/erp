"use client";

import { Campaign } from "@/types/campaigns";
import { PerformanceChart } from "./performance-chart";
import { BudgetUsageChart } from "./budget-usage-chart";

interface CampaignAnalyticsProps {
  campaigns: Campaign[];
}

export function CampaignAnalytics({ campaigns }: CampaignAnalyticsProps) {
  return (
    <div style={{ marginTop: "32px" }}>
      <h2 style={{ margin: "0 0 24px 0", fontSize: "18px", fontWeight: "700", color: "var(--foreground)" }}>
        Analytics & Performance
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <PerformanceChart campaigns={campaigns} />
        <BudgetUsageChart campaigns={campaigns} />
      </div>
    </div>
  );
}
