"use client";

import { useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { useToast } from "@/components/toast";

export function StockAdjustmentModal({ isOpen, onClose, equipmentId }: { isOpen: boolean; onClose: ()=>void; equipmentId: string }) {
  const { equipment, adjustStock } = useEquipment();
  const item = equipment.find(e=>e.id===equipmentId) || null;
  const { showToast } = useToast();
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState("receive");

  if (!isOpen || !item) return null;

  const submit = () => {
    if (item.quantity + delta < 0) {
      showToast("Cannot reduce below zero", "error");
      return;
    }
    adjustStock(item.id, delta, reason, "Admin");
    showToast("Stock adjusted", "success");
    onClose();
  };

  const newQuantity = item.quantity + delta;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "600px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <h2>Adjust Stock — {item.name}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            {/* Current Stock Display */}
            <div style={{ 
              background: "var(--background)", 
              border: "1px solid var(--border)", 
              borderRadius: "8px", 
              padding: "16px",
              marginBottom: "20px"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>Current Qty</div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--foreground)" }}>{item.quantity}</div>
                </div>
                <div style={{ fontSize: "20px", color: "var(--secondary)" }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "var(--secondary)", marginBottom: "4px" }}>New Qty</div>
                  <div style={{ 
                    fontSize: "24px", 
                    fontWeight: "600", 
                    color: newQuantity < 0 ? "var(--danger)" : newQuantity < item.minStock ? "var(--warning)" : "var(--success)"
                  }}>
                    {newQuantity}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Delta (+/-)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={delta} 
                  onChange={(e)=>setDelta(parseInt(e.target.value||'0'))}
                  placeholder="Enter adjustment amount"
                  autoFocus
                />
                <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                  Use negative values to reduce stock
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <select className="form-input" value={reason} onChange={(e)=>setReason(e.target.value)}>
                  <option value="receive">Receive</option>
                  <option value="consume">Consume</option>
                  <option value="transfer">Transfer</option>
                  <option value="correction">Inventory Correction</option>
                </select>
              </div>
            </div>

            {newQuantity < 0 && (
              <div style={{ 
                padding: "12px", 
                background: "rgba(239, 68, 68, 0.1)", 
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#ef4444"
              }}>
                ⚠️ Warning: Adjustment would result in negative stock quantity
              </div>
            )}

            {newQuantity >= 0 && newQuantity < item.minStock && (
              <div style={{ 
                padding: "12px", 
                background: "rgba(251, 191, 36, 0.1)", 
                border: "1px solid rgba(251, 191, 36, 0.3)",
                borderRadius: "6px",
                fontSize: "13px",
                color: "#fbbf24"
              }}>
                ⚠️ Note: New quantity will be below minimum stock level ({item.minStock})
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Apply Adjustment</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
