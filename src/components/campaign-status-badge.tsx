"use client";

import { CampaignStatus } from "@/types/campaigns";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const statusConfig: Record<CampaignStatus, { bg: string; color: string; text: string }> = {
    Active: { bg: "#dbeafe", color: "#0369a1", text: "Active" },
    Completed: { bg: "#dcfce7", color: "#166534", text: "Completed" },
    Draft: { bg: "#f3f4f6", color: "#6b7280", text: "Draft" },
  };

  const config = statusConfig[status];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        background: config.bg,
        color: config.color,
        fontSize: "12px",
        fontWeight: "600",
        borderRadius: "20px",
        textTransform: "uppercase",
      }}
    >
      {config.text}
    </span>
  );
}
