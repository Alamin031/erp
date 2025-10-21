"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "./toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceId?: string;
  invoiceNumber?: string;
  dueAmount?: number;
  onSave?: (data: any) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  dueAmount = 0,
  onSave,
}: PaymentModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: dueAmount,
    method: "Bank Transfer" as any,
    reference: "",
    transactionId: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.amount || formData.amount <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    onSave?.(formData);
    showToast("Payment recorded successfully", "success");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="modal-header">
          <h2>Record Payment {invoiceNumber && `- ${invoiceNumber}`}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input
                type="number"
                className="form-input"
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method *</label>
              <select
                className="form-input"
                value={formData.method}
                onChange={e => setFormData(prev => ({ ...prev, method: e.target.value }))}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reference Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.reference}
                onChange={e => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Check #, Invoice #, etc."
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Transaction ID</label>
              <input
                type="text"
                className="form-input"
                value={formData.transactionId}
                onChange={e => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                placeholder="Bank transaction ID or reference"
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                rows={3}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Record Payment
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
