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

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>Adjust Stock — {item.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Delta (+/-)</label>
              <input type="number" className="form-input" value={delta} onChange={(e)=>setDelta(parseInt(e.target.value||'0'))} />
            </div>
            <div>
              <label className="form-label">Reason</label>
              <select className="form-input" value={reason} onChange={(e)=>setReason(e.target.value)}>
                <option value="receive">Receive</option>
                <option value="consume">Consume</option>
                <option value="transfer">Transfer</option>
                <option value="correction">Inventory Correction</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-secondary">Current Qty: {item.quantity}</div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={submit}>Apply</button>
          </div>
        </div>
      </div>
    </>
  );
}
