"use client";

import { useToast } from "./toast";

interface InvoiceQuickActionsProps {
  onCreateNew?: () => void;
  onExportCSV?: () => void;
  onExportPDF?: () => void;
  onSendReminders?: () => void;
  onRefresh?: () => void;
  overdueCount?: number;
}

export function InvoiceQuickActions({
  onCreateNew,
  onExportCSV,
  onExportPDF,
  onSendReminders,
  onRefresh,
  overdueCount = 0,
}: InvoiceQuickActionsProps) {
  const { showToast } = useToast();

  const handleExportCSV = () => {
    onExportCSV?.();
    showToast("Invoices exported as CSV", "success");
  };

  const handleExportPDF = () => {
    onExportPDF?.();
    showToast("PDF export coming soon", "info");
  };

  const handleSendReminders = () => {
    if (overdueCount === 0) {
      showToast("No overdue invoices to remind", "info");
      return;
    }
    onSendReminders?.();
    showToast(`Reminder emails sent to ${overdueCount} clients`, "success");
  };

  const handleRefresh = () => {
    onRefresh?.();
    showToast("Invoices refreshed", "info");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={onCreateNew}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "white",
          background: "var(--primary)",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.opacity = "0.8";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        <span>➕</span>
        Create New Invoice
      </button>

      <button
        onClick={handleExportCSV}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--primary)",
          background: "transparent",
          border: "1px solid var(--primary)",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--primary)";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--primary)";
        }}
      >
        <span>📥</span>
        Export CSV
      </button>

      <button
        onClick={handleExportPDF}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--foreground)",
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
          (e.currentTarget as HTMLElement).style.background = "var(--primary)";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.background = "var(--background)";
          (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
        }}
      >
        <span>📄</span>
        Export PDF
      </button>

      {overdueCount > 0 && (
        <button
          onClick={handleSendReminders}
          style={{
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "600",
            color: "white",
            background: "#dc3545",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = "0.8";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <span>⚠️</span>
          Send Reminders ({overdueCount})
        </button>
      )}

      <button
        onClick={handleRefresh}
        style={{
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--foreground)",
          background: "var(--background)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
          (e.currentTarget as HTMLElement).style.color = "var(--primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
        }}
      >
        <span>🔄</span>
        Refresh Data
      </button>
    </div>
  );
}
