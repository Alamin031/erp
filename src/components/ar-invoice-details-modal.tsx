"use client";

import { ARInvoice } from "@/types/accounting";
import { motion } from "framer-motion";

interface ARInvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: ARInvoice | null;
  onRecordPayment?: (invoiceId: string) => void;
}

export function ARInvoiceDetailsModal({
  isOpen,
  onClose,
  invoice,
  onRecordPayment,
}: ARInvoiceDetailsModalProps) {
  if (!isOpen || !invoice) return null;

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

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: "700px" }}
        >
          <div className="modal-header">
            <h2>Invoice Details</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-form">
            {/* Header Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "20px",
                background: "var(--background)",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>
                  {invoice.invoiceNumber}
                </h3>
                <p style={{ margin: "0", fontSize: "14px", color: "var(--secondary)" }}>
                  Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: getStatusColor(invoice.status),
                  backgroundColor: `${getStatusColor(invoice.status)}20`,
                }}
              >
                {invoice.status}
              </span>
            </div>

            {/* Client Information */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Bill To
              </h4>
              <div
                style={{
                  padding: "16px",
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                }}
              >
                <p style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "var(--foreground)" }}>
                  {invoice.clientName}
                </p>
                <p style={{ margin: "0", fontSize: "13px", color: "var(--secondary)" }}>
                  Client ID: {invoice.clientId}
                </p>
              </div>
            </div>

            {/* Amount Details */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Payment Information
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div
                  style={{
                    padding: "16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Total Amount</p>
                  <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
                    ${invoice.amount.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Paid Amount</p>
                  <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: "var(--success)" }}>
                    ${invoice.paidAmount.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    background: invoice.balance > 0 ? "rgba(220, 53, 69, 0.1)" : "rgba(40, 167, 69, 0.1)",
                    border: `1px solid ${invoice.balance > 0 ? "#dc3545" : "#28a745"}`,
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Balance Due</p>
                  <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: invoice.balance > 0 ? "#dc3545" : "#28a745" }}>
                    ${invoice.balance.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Due Date</p>
                  <p style={{ margin: "0", fontSize: "16px", fontWeight: "600", color: invoice.status === "Overdue" ? "#dc3545" : "var(--foreground)" }}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            {invoice.terms && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Payment Terms
                </h4>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                  }}
                >
                  {invoice.terms}
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                  Notes
                </h4>
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "var(--foreground)",
                    lineHeight: "1.5",
                  }}
                >
                  {invoice.notes}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div
              style={{
                padding: "12px 16px",
                background: "var(--background)",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--secondary)",
              }}
            >
              <span>Created: {new Date(invoice.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(invoice.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {invoice.status !== "Paid" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onRecordPayment?.(invoice.id);
                  onClose();
                }}
              >
                Record Payment
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
