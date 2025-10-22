"use client";

import { useState } from "react";
import { ARInvoice, APBill, PaymentMethod } from "@/types/accounting";
import { useToast } from "./toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ARInvoice | APBill | null;
  onSubmit: (data: PaymentData) => void;
  banks: any[];
}

export interface PaymentData {
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  bankAccountId?: string;
  notes?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  item,
  onSubmit,
  banks,
}: PaymentModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<PaymentData>({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    method: "Bank Transfer",
    reference: "",
    bankAccountId: banks[0]?.id || "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = "Date is required";
    if (formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.method) newErrors.method = "Payment method is required";
    if (!formData.reference) newErrors.reference = "Reference is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    if (!item) {
      showToast("No item selected", "error");
      return;
    }

    const maxPayment = "balance" in item ? item.balance : 0;
    if (formData.amount > maxPayment) {
      showToast(
        `Payment cannot exceed balance of $${maxPayment.toFixed(2)}`,
        "error"
      );
      return;
    }

    onSubmit(formData);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      method: "Bank Transfer",
      reference: "",
      bankAccountId: banks[0]?.id || "",
      notes: "",
    });
    onClose();
  };

  if (!isOpen || !item) return null;

  const maxPayment = "balance" in item ? item.balance : 0;
  const itemNumber =
    "invoiceNumber" in item ? item.invoiceNumber : item.billNumber;

  // changed code: add centralized style object and grid layout for nicer alignment
  const styles: Record<string, React.CSSProperties> = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    content: {
      background: "var(--card-bg)",
      borderRadius: "8px",
      padding: "24px",
      maxWidth: "640px",
      width: "100%",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
    },
    header: {
      margin: "0 0 20px 0",
      fontSize: "20px",
      fontWeight: 700,
      color: "var(--foreground)",
    },
    infoBox: {
      marginBottom: "18px",
      padding: "14px",
      background: "var(--background)",
      borderRadius: "6px",
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
    },
    infoItem: {
      margin: 0,
      fontSize: "14px",
      color: "var(--secondary)",
    },
    form: {
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: "12px 16px",
      alignItems: "center",
    },
    fieldFull: {
      gridColumn: "1 / -1",
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: "12px 16px",
      alignItems: "start",
    },
    label: {
      fontSize: "14px",
      color: "var(--secondary)",
      paddingTop: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid var(--border)",
      background: "var(--input-bg, transparent)",
      color: "var(--foreground)",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: "1px solid var(--border)",
      background: "var(--input-bg, transparent)",
      color: "var(--foreground)",
      fontSize: "14px",
      minHeight: "80px",
      resize: "vertical",
      boxSizing: "border-box",
    },
    error: {
      color: "#dc3545",
      fontSize: "12px",
      marginTop: "6px",
      gridColumn: "2 / 3",
    },
    footer: {
      gridColumn: "1 / -1",
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
      marginTop: "6px",
      paddingTop: "12px",
    },
    cancelBtn: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: 600,
      color: "var(--foreground)",
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.12s",
    },
    submitBtn: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: 600,
      color: "white",
      background: "var(--primary)",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.12s",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.header}>Record Payment</h2>

        <div style={styles.infoBox}>
          <p style={styles.infoItem}>
            Item:{" "}
            <strong style={{ color: "var(--foreground)" }}>{itemNumber}</strong>
          </p>
          <p style={styles.infoItem}>
            Balance:{" "}
            <strong style={{ color: "var(--foreground)" }}>
              ${maxPayment.toFixed(2)}
            </strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={undefined}>
            <label style={styles.label}>Payment Date</label>
            <input
              type="date"
              className="form-input"
              style={styles.input}
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: "" });
              }}
            />
          </div>
          {errors.date && <div style={styles.error}>{errors.date}</div>}

          <div>
            <label style={styles.label}>Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              max={maxPayment}
              style={styles.input}
              value={formData.amount}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value) || 0,
                });
                if (errors.amount) setErrors({ ...errors, amount: "" });
              }}
            />
          </div>
          {errors.amount && <div style={styles.error}>{errors.amount}</div>}

          <div>
            <label style={styles.label}>Payment Method</label>
            <select
              className="form-input"
              style={styles.input}
              value={formData.method}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  method: e.target.value as PaymentMethod,
                });
                if (errors.method) setErrors({ ...errors, method: "" });
              }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
            </select>
          </div>
          {errors.method && <div style={styles.error}>{errors.method}</div>}

          {formData.method === "Bank Transfer" && (
            <>
              <div>
                <label style={styles.label}>Bank Account</label>
                <select
                  className="form-input"
                  style={styles.input}
                  value={formData.bankAccountId}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountId: e.target.value })
                  }
                >
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.accountName} - {bank.bankName}
                    </option>
                  ))}
                </select>
              </div>
              <div /> {/* spacer to keep grid alignment */}
            </>
          )}

          <div style={styles.fieldFull}>
            <label style={styles.label}>Reference / Transaction ID</label>
            <div>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Check #1234, Reference number"
                style={styles.input}
                value={formData.reference}
                onChange={(e) => {
                  setFormData({ ...formData, reference: e.target.value });
                  if (errors.reference) setErrors({ ...errors, reference: "" });
                }}
              />
              {errors.reference && (
                <p style={{ ...styles.error, marginTop: 8 }}>
                  {errors.reference}
                </p>
              )}
            </div>
          </div>

          <div style={styles.fieldFull}>
            <label style={styles.label}>Notes (Optional)</label>
            <textarea
              className="form-input"
              placeholder="Additional notes..."
              style={styles.textarea}
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
