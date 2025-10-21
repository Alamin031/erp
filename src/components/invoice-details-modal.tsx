"use client";

import { Invoice } from "@/types/invoice";
import { motion } from "framer-motion";
import { useToast } from "./toast";
import { useInvoices } from "@/store/useInvoices";

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  onMarkPaid?: (id: string, paymentMethod: string, transactionId: string) => void;
}

export function InvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
  onMarkPaid,
}: InvoiceDetailsModalProps) {
  const { showToast } = useToast();

  if (!isOpen || !invoice) return null;

  const handleMarkPaid = () => {
    const transactionId = `TXN-${Date.now()}`;
    onMarkPaid?.(invoice.id, "Bank Transfer", transactionId);
    showToast("Invoice marked as paid", "success");
    onClose();
  };

  const handleDownloadPDF = () => {
    showToast("PDF download feature coming soon", "info");
  };

  const handleSendEmail = () => {
    if (!invoice.clientEmail) {
      showToast("Client email not available", "error");
      return;
    }
    showToast(`Invoice sent to ${invoice.clientEmail}`, "success");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "#28a745";
      case "Pending":
        return "#ffc107";
      case "Overdue":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="modal-header">
          <h2>Invoice {invoice.invoiceNumber}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                Invoice Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Invoice Number</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {invoice.invoiceNumber}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Status</span>
                  <span
                    style={{
                      fontWeight: "600",
                      color: getStatusColor(invoice.status),
                      backgroundColor: `${getStatusColor(invoice.status)}20`,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Issue Date</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Due Date</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {invoice.paidDate && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Paid Date</span>
                    <span style={{ fontWeight: "600", color: "#28a745" }}>
                      {new Date(invoice.paidDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                Client Information
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Name</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {invoice.clientName}
                  </span>
                </div>

                {invoice.clientCompany && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Company</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                      {invoice.clientCompany}
                    </span>
                  </div>
                )}

                {invoice.clientEmail && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Email</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                      {invoice.clientEmail}
                    </span>
                  </div>
                )}

                {invoice.clientPhone && (
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Phone</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                      {invoice.clientPhone}
                    </span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Type</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    {invoice.clientType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Line Items
            </h3>

            <div style={{ background: "var(--background)", borderRadius: "6px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--card-bg)" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                      Description
                    </th>
                    <th style={{ padding: "12px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                      Qty
                    </th>
                    <th style={{ padding: "12px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                      Rate
                    </th>
                    <th style={{ padding: "12px", textAlign: "right", fontSize: "12px", fontWeight: "600", color: "var(--secondary)" }}>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px", fontSize: "13px", color: "var(--foreground)" }}>
                        {item.description}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", color: "var(--foreground)" }}>
                        ${item.rate.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "var(--primary)" }}>
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Subtotal</span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    ${invoice.subtotal.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                    Tax ({(invoice.taxRate * 100).toFixed(1)}%)
                  </span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    ${invoice.taxAmount.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "13px", color: "var(--secondary)" }}>
                    Discount ({(invoice.discountRate * 100).toFixed(1)}%)
                  </span>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                    -${invoice.discountAmount.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", fontSize: "16px" }}>
                  <span style={{ fontWeight: "600", color: "var(--foreground)" }}>Grand Total</span>
                  <span style={{ fontWeight: "700", color: "var(--primary)", fontSize: "18px" }}>
                    ${invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {invoice.paymentMethod && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
                  Payment Information
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Method</span>
                    <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                      {invoice.paymentMethod}
                    </span>
                  </div>

                  {invoice.transactionId && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "13px", color: "var(--secondary)" }}>Transaction ID</span>
                      <span style={{ fontWeight: "600", color: "var(--foreground)", fontSize: "12px" }}>
                        {invoice.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {invoice.notes && (
            <div style={{ marginBottom: "24px", padding: "12px", background: "var(--background)", borderRadius: "6px", borderLeft: "4px solid var(--primary)" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "600", color: "var(--foreground)" }}>
                Notes
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--secondary)" }}>
                {invoice.notes}
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              {invoice.status !== "Paid" && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleMarkPaid}
                >
                  Mark as Paid
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSendEmail}
              >
                Send via Email
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
