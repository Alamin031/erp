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

export function PaymentModal({ isOpen, onClose, item, onSubmit, banks }: PaymentModalProps) {
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
    if (formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
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
      showToast(`Payment cannot exceed balance of $${maxPayment.toFixed(2)}`, "error");
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
  const itemNumber = "invoiceNumber" in item ? item.invoiceNumber : item.billNumber;

  return (
    <div
      style={{
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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700", color: "var(--foreground)" }}>
          Record Payment
        </h2>

        <div style={{ marginBottom: "16px", padding: "12px", background: "var(--background)", borderRadius: "4px" }}>
          <p style={{ margin: "4px 0", fontSize: "14px", color: "var(--secondary)" }}>
            Item: <strong style={{ color: "var(--foreground)" }}>{itemNumber}</strong>
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px", color: "var(--secondary)" }}>
            Balance: <strong style={{ color: "var(--foreground)" }}>${maxPayment.toFixed(2)}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label className="form-label">Payment Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: "" });
              }}
            />
            {errors.date && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.date}</p>}
          </div>

          <div>
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              max={maxPayment}
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 });
                if (errors.amount) setErrors({ ...errors, amount: "" });
              }}
            />
            {errors.amount && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.amount}</p>}
          </div>

          <div>
            <label className="form-label">Payment Method</label>
            <select
              className="form-input"
              value={formData.method}
              onChange={(e) => {
                setFormData({ ...formData, method: e.target.value as PaymentMethod });
                if (errors.method) setErrors({ ...errors, method: "" });
              }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
            </select>
            {errors.method && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.method}</p>}
          </div>

          {formData.method === "Bank Transfer" && (
            <div>
              <label className="form-label">Bank Account</label>
              <select
                className="form-input"
                value={formData.bankAccountId}
                onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
              >
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.accountName} - {bank.bankName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">Reference / Transaction ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Check #1234, Reference number"
              value={formData.reference}
              onChange={(e) => {
                setFormData({ ...formData, reference: e.target.value });
                if (errors.reference) setErrors({ ...errors, reference: "" });
              }}
            />
            {errors.reference && <p style={{ color: "#dc3545", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.reference}</p>}
          </div>

          <div>
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-input"
              placeholder="Additional notes..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--foreground)",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                background: "var(--primary)",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
