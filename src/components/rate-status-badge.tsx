"use client";

import { RateStatus } from "@/types/rates";

interface RateStatusBadgeProps {
  status: RateStatus;
}

export function RateStatusBadge({ status }: RateStatusBadgeProps) {
  const statusConfig: Record<RateStatus, { bg: string; color: string; text: string }> = {
    Active: { bg: "#dcfce7", color: "#166534", text: "Active" },
    Scheduled: { bg: "#dbeafe", color: "#0369a1", text: "Scheduled" },
    Expired: { bg: "#f3f4f6", color: "#6b7280", text: "Expired" },
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
