"use client";

interface QuickActionsProps {
  onCreateJournal?: () => void;
  onRecordPayment?: () => void;
  onReconcile?: () => void;
  onExportReport?: () => void;
  onCreateAdjustment?: () => void;
}

export function QuickActions({
  onCreateJournal,
  onRecordPayment,
  onReconcile,
  onExportReport,
  onCreateAdjustment,
}: QuickActionsProps) {
  const actions = [
    {
      icon: "📝",
      label: "Create Journal Entry",
      description: "Record a new journal entry",
      onClick: onCreateJournal,
      color: "#0066cc",
    },
    {
      icon: "💳",
      label: "Record Payment",
      description: "Record a new payment",
      onClick: onRecordPayment,
      color: "#28a745",
    },
    {
      icon: "🏦",
      label: "Bank Reconciliation",
      description: "Reconcile bank transactions",
      onClick: onReconcile,
      color: "#ffc107",
    },
    {
      icon: "📊",
      label: "Export Report",
      description: "Export accounting reports",
      onClick: onExportReport,
      color: "#9c27b0",
    },
    {
      icon: "⚙️",
      label: "Manual Adjustment",
      description: "Create manual adjustments",
      onClick: onCreateAdjustment,
      color: "#f44336",
    },
  ];

  return (
    <div style={{ marginBottom: "24px" }}>
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          fontWeight: "600",
          color: "var(--foreground)",
        }}
      >
        Quick Actions
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            style={{
              padding: "16px",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = action.color;
              (e.currentTarget as HTMLElement).style.background = `${action.color}10`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.background = "var(--card-bg)";
            }}
          >
            <span style={{ fontSize: "24px" }}>{action.icon}</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: action.color,
              }}
            >
              {action.label}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "var(--secondary)",
              }}
            >
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
