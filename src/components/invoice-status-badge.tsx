"use client";

import { InvoiceStatus } from "@/types/invoice";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const getStatusStyles = (status: InvoiceStatus) => {
    switch (status) {
      case "Paid":
        return {
          bg: "#28a74520",
          color: "#28a745",
          icon: "✓",
        };
      case "Pending":
        return {
          bg: "#ffc10720",
          color: "#ffc107",
          icon: "⏱",
        };
      case "Overdue":
        return {
          bg: "#dc354520",
          color: "#dc3545",
          icon: "⚠",
        };
      default:
        return {
          bg: "#6c757d20",
          color: "#6c757d",
          icon: "?",
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: styles.bg,
        color: styles.color,
        textTransform: "capitalize",
      }}
    >
      <span>{styles.icon}</span>
      {status}
    </span>
  );
}
