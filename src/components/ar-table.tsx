"use client";

import { ARInvoice } from "@/types/accounting";
import { useToast } from "./toast";

interface ARTableProps {
  invoices: ARInvoice[];
  onRecordPayment?: (invoiceId: string) => void;
  onViewInvoice?: (invoice: ARInvoice) => void;
  onSendReminder?: (invoiceId: string) => void;
}

export function ARTable({
  invoices,
  onRecordPayment,
  onViewInvoice,
  onSendReminder,
}: ARTableProps) {
  const { showToast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "#28a745";
      case "Pending":
        return "#0066cc";
      case "Overdue":
        return "#dc3545";
      case "Partial":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  };

  if (invoices.length === 0) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--secondary)",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px" }}>No accounts receivable records found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--background)" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Invoice
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Client
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Amount
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Paid
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Balance
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Due Date
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr
                key={invoice.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--background)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "var(--primary)" }}>
                  {invoice.invoiceNumber}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--foreground)" }}>
                  {invoice.clientName}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: "var(--foreground)" }}>
                  ${invoice.amount.toFixed(2)}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", color: "var(--secondary)" }}>
                  ${invoice.paidAmount.toFixed(2)}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "600", color: invoice.balance > 0 ? "#dc3545" : "#28a745" }}>
                  ${invoice.balance.toFixed(2)}
                </td>
                <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)" }}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: getStatusColor(invoice.status),
                      backgroundColor: `${getStatusColor(invoice.status)}20`,
                    }}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "4px", justifyContent: "center", flexWrap: "wrap" }}>
                    {invoice.status !== "Paid" && (
                      <button
                        onClick={() => onRecordPayment?.(invoice.id)}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--primary)",
                          background: "transparent",
                          border: "1px solid var(--primary)",
                          borderRadius: "3px",
                          cursor: "pointer",
                          transition: "all 0.2s",
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
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => onViewInvoice?.(invoice)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "var(--foreground)",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                    {invoice.status !== "Paid" && (
                      <button
                        onClick={() => {
                          onSendReminder?.(invoice.id);
                          showToast("Reminder sent", "success");
                        }}
                        style={{
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#ffc107",
                          background: "transparent",
                          border: "1px solid #ffc107",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        ⏱
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
