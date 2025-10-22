"use client";

import { useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { useWorkOrders } from "@/store/useWorkOrders";
import { useToast } from "@/components/toast";

export function MaintenanceLinkModal({ isOpen, onClose, equipmentId }: { isOpen: boolean; onClose: ()=>void; equipmentId: string }) {
  const { equipment, linkWorkOrder } = useEquipment();
  const { createWorkOrder } = useWorkOrders();
  const { showToast } = useToast();
  const item = equipment.find(e=>e.id===equipmentId) || null;
  const [existingId, setExistingId] = useState("");

  if (!isOpen || !item) return null;

  const createWO = () => {
    const id = `WO-${Date.now()}`;
    createWorkOrder({
      id,
      title: `Maintenance for ${item.name}`,
      description: `Auto-created from equipment ${item.id}`,
      assetId: item.id,
      assetName: item.name,
      assetType: "Other",
      requestedBy: "System",
      priority: "Medium",
      createdAt: new Date().toISOString(),
      dueAt: undefined,
      assignedTechId: undefined,
      assignedTechName: undefined,
      status: "Open",
      attachments: [],
      comments: [],
      logs: [],
    } as any);
    linkWorkOrder(item.id, id, "System");
    showToast("Work order created & linked", "success");
    onClose();
  };

  const linkExisting = () => {
    if (!existingId.trim()) return;
    linkWorkOrder(item.id, existingId.trim(), "Admin");
    showToast("Linked to existing WO", "success");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>Link Maintenance — {item.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <button className="btn btn-primary w-full" onClick={createWO}>+ Create Work Order</button>
          <div className="flex items-center gap-2 mt-3">
            <input className="form-input flex-1" placeholder="Existing Work Order ID" value={existingId} onChange={(e)=>setExistingId(e.target.value)} />
            <button className="btn btn-secondary" onClick={linkExisting} disabled={!existingId.trim()}>Link</button>
          </div>
        </div>
      </div>
    </>
  );
}
