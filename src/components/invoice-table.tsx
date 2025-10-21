"use client";

import { Invoice } from "@/types/invoice";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { useToast } from "./toast";

interface InvoiceTableProps {
  invoices: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (id: string) => void;
}

export function InvoiceTable({
  invoices,
  onRowClick,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const { showToast } = useToast();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      onDelete?.(id);
      showToast("Invoice deleted successfully", "success");
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
        <p style={{ margin: 0, fontSize: "14px" }}>
          No invoices found. Create a new invoice to get started.
        </p>
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
                Invoice ID
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Client Name
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Amount
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Issued Date
              </th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Due Date
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
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "var(--background)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <td
                  style={{ padding: "12px 16px", cursor: "pointer" }}
                  onClick={() => onRowClick?.(invoice)}
                >
                  <span style={{ fontWeight: "600", color: "var(--primary)" }}>
                    {invoice.invoiceNumber}
                  </span>
                </td>
                <td
                  style={{ padding: "12px 16px", fontSize: "14px", color: "var(--foreground)", cursor: "pointer" }}
                  onClick={() => onRowClick?.(invoice)}
                >
                  {invoice.clientName}
                </td>
                <td
                  style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "600", color: "var(--primary)", cursor: "pointer" }}
                  onClick={() => onRowClick?.(invoice)}
                >
                  ${invoice.totalAmount.toFixed(2)}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td
                  style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)", cursor: "pointer" }}
                  onClick={() => onRowClick?.(invoice)}
                >
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </td>
                <td
                  style={{ padding: "12px 16px", fontSize: "13px", color: "var(--secondary)", cursor: "pointer" }}
                  onClick={() => onRowClick?.(invoice)}
                >
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <button
                      onClick={() => onRowClick?.(invoice)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--primary)",
                        background: "transparent",
                        border: "1px solid var(--primary)",
                        borderRadius: "4px",
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
                      View
                    </button>
                    <button
                      onClick={() => onEdit?.(invoice)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--foreground)",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#dc3545",
                        background: "transparent",
                        border: "1px solid #dc3545",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#dc3545";
                        (e.currentTarget as HTMLElement).style.color = "white";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#dc3545";
                      }}
                    >
                      Delete
                    </button>
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
