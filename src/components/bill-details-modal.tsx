"use client";

import { APBill } from "@/types/accounting";
import { motion } from "framer-motion";

interface BillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: APBill | null;
  onRecordPayment?: (billId: string) => void;
}

export function BillDetailsModal({
  isOpen,
  onClose,
  bill,
  onRecordPayment,
}: BillDetailsModalProps) {
  if (!isOpen || !bill) return null;

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
            <h2>Bill Details</h2>
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
                  {bill.billNumber}
                </h3>
                <p style={{ margin: "0", fontSize: "14px", color: "var(--secondary)" }}>
                  Bill Date: {new Date(bill.billDate).toLocaleDateString()}
                </p>
              </div>
              <span
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: getStatusColor(bill.status),
                  backgroundColor: `${getStatusColor(bill.status)}20`,
                }}
              >
                {bill.status}
              </span>
            </div>

            {/* Vendor Information */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "var(--secondary)", textTransform: "uppercase" }}>
                Vendor Information
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
                  {bill.vendorName}
                </p>
                <p style={{ margin: "0", fontSize: "13px", color: "var(--secondary)" }}>
                  Vendor ID: {bill.vendorId}
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
                    ${bill.amount.toFixed(2)}
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
                    ${bill.paidAmount.toFixed(2)}
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    background: bill.balance > 0 ? "rgba(220, 53, 69, 0.1)" : "rgba(40, 167, 69, 0.1)",
                    border: `1px solid ${bill.balance > 0 ? "#dc3545" : "#28a745"}`,
                    borderRadius: "6px",
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "var(--secondary)" }}>Balance Due</p>
                  <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: bill.balance > 0 ? "#dc3545" : "#28a745" }}>
                    ${bill.balance.toFixed(2)}
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
                  <p style={{ margin: "0", fontSize: "16px", fontWeight: "600", color: bill.status === "Overdue" ? "#dc3545" : "var(--foreground)" }}>
                    {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {bill.notes && (
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
                  {bill.notes}
                </div>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {bill.status !== "Paid" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onRecordPayment?.(bill.id);
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
