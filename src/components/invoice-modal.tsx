"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Invoice, InvoiceItem, PaymentMethod, ClientType } from "@/types/invoice";
import { useToast } from "./toast";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  onSave?: (invoice: Invoice) => void;
}

export function InvoiceModal({
  isOpen,
  onClose,
  invoice,
  onSave,
}: InvoiceModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientPhone: "",
    clientType: "Guest" as ClientType,
    roomNumber: "",
    serviceDescription: "",
    items: [] as InvoiceItem[],
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    taxRate: 0.1,
    discountRate: 0,
    paymentMethod: "" as PaymentMethod | "",
    notes: "",
  });

  const [itemInput, setItemInput] = useState({
    description: "",
    quantity: 1,
    rate: 0,
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientCompany: invoice.clientCompany || "",
        clientEmail: invoice.clientEmail || "",
        clientPhone: invoice.clientPhone || "",
        clientType: invoice.clientType,
        roomNumber: invoice.roomNumber || "",
        serviceDescription: invoice.serviceDescription || "",
        items: invoice.items,
        issueDate: invoice.issueDate.split("T")[0],
        dueDate: invoice.dueDate.split("T")[0],
        taxRate: invoice.taxRate,
        discountRate: invoice.discountRate,
        paymentMethod: invoice.paymentMethod || "",
        notes: invoice.notes || "",
      });
    }
  }, [invoice]);

  if (!isOpen) return null;

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * formData.taxRate;
    const discountAmount = subtotal * formData.discountRate;
    return {
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount: subtotal + taxAmount - discountAmount,
    };
  };

  const totals = calculateTotals();

  const handleAddItem = () => {
    if (!itemInput.description || itemInput.quantity <= 0 || itemInput.rate <= 0) {
      showToast("Please fill in all item fields", "error");
      return;
    }

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: itemInput.description,
      quantity: itemInput.quantity,
      rate: itemInput.rate,
      amount: itemInput.quantity * itemInput.rate,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setItemInput({
      description: "",
      quantity: 1,
      rate: 0,
    });

    showToast("Item added", "success");
  };

  const handleRemoveItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const handleSave = () => {
    if (!formData.clientName || !formData.invoiceNumber) {
      showToast("Please fill in invoice number and client name", "error");
      return;
    }

    if (formData.items.length === 0) {
      showToast("Please add at least one item", "error");
      return;
    }

    const newInvoice: Invoice = {
      id: invoice?.id || `inv-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber,
      clientName: formData.clientName,
      clientCompany: formData.clientCompany || undefined,
      clientEmail: formData.clientEmail || undefined,
      clientPhone: formData.clientPhone || undefined,
      clientType: formData.clientType,
      roomNumber: formData.roomNumber || undefined,
      serviceDescription: formData.serviceDescription || undefined,
      items: formData.items,
      issueDate: new Date(formData.issueDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
      subtotal: totals.subtotal,
      taxRate: formData.taxRate,
      taxAmount: totals.taxAmount,
      discountRate: formData.discountRate,
      discountAmount: totals.discountAmount,
      totalAmount: totals.totalAmount,
      status: invoice?.status || "Pending",
      paymentMethod: (formData.paymentMethod as PaymentMethod) || undefined,
      notes: formData.notes || undefined,
      createdAt: invoice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidDate: invoice?.paidDate,
      transactionId: invoice?.transactionId,
    };

    onSave?.(newInvoice);
    showToast(invoice ? "Invoice updated successfully" : "Invoice created successfully", "success");
    onClose();
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1000 }}
      />
      {/* wrapper keeps the fixed translate centering; inner .modal-card is animated */}
      <div className="modal" style={{ zIndex: 1001 }}>
        <motion.div
          className="modal-card"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
        <div className="modal-header">
          <h2>{invoice ? "Edit Invoice" : "Create New Invoice"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className="form-group">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.invoiceNumber}
                onChange={e => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                placeholder="INV-2024-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client Type</label>
              <select
                className="form-input"
                value={formData.clientType}
                onChange={e => setFormData(prev => ({ ...prev, clientType: e.target.value as ClientType }))}
              >
                <option value="Guest">Guest</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Client Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="John Smith"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.clientCompany}
                onChange={e => setFormData(prev => ({ ...prev, clientCompany: e.target.value }))}
                placeholder="ABC Corporation"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.clientEmail}
                onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.clientPhone}
                onChange={e => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                placeholder="+1-234-567-8900"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.roomNumber}
                onChange={e => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                placeholder="101"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service Description</label>
              <input
                type="text"
                className="form-input"
                value={formData.serviceDescription}
                onChange={e => setFormData(prev => ({ ...prev, serviceDescription: e.target.value }))}
                placeholder="5-night stay - Deluxe Suite"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.issueDate}
                onChange={e => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input
                type="number"
                className="form-input"
                value={formData.taxRate * 100}
                onChange={e => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) / 100 }))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Rate (%)</label>
              <input
                type="number"
                className="form-input"
                value={formData.discountRate * 100}
                onChange={e => setFormData(prev => ({ ...prev, discountRate: parseFloat(e.target.value) / 100 }))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "14px", fontWeight: "600", color: "var(--foreground)" }}>
              Line Items
            </h3>

            {formData.items.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                {formData.items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px",
                      background: "var(--background)",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "600", color: "var(--foreground)" }}>
                        {item.description}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--secondary)" }}>
                        {item.quantity} × ${item.rate.toFixed(2)} = ${item.amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        color: "#dc3545",
                        background: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Description"
                value={itemInput.description}
                onChange={e => setItemInput(prev => ({ ...prev, description: e.target.value }))}
              />
              <input
                type="number"
                className="form-input"
                placeholder="Qty"
                value={itemInput.quantity}
                onChange={e => setItemInput(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                min="1"
              />
              <input
                type="number"
                className="form-input"
                placeholder="Rate"
                value={itemInput.rate}
                onChange={e => setItemInput(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
              />
              <button
                onClick={handleAddItem}
                style={{
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  background: "var(--primary)",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Item
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                <span style={{ color: "var(--secondary)" }}>Subtotal</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                <span style={{ color: "var(--secondary)" }}>Tax</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  ${totals.taxAmount.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px" }}>
                <span style={{ color: "var(--secondary)" }}>Discount</span>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>
                  -${totals.discountAmount.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "16px", borderTop: "1px solid var(--border)", marginTop: "8px", paddingTop: "12px" }}>
                <span style={{ fontWeight: "600", color: "var(--foreground)" }}>Total</span>
                <span style={{ fontWeight: "700", color: "var(--primary)" }}>
                  ${totals.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                rows={6}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {invoice ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </div>
        </motion.div>
      </div>
    </>
  );
}
