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
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "650px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <h2>Link Maintenance — {item.name}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <form className="modal-form" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="form-group">
              <label className="form-label">Create New Work Order</label>
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={createWO}
                style={{ width: "100%" }}
              >
                + Create Work Order
              </button>
              <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                Creates a new work order and automatically links it to this equipment
              </p>
            </div>

            <div style={{ 
              margin: "24px 0", 
              height: "1px", 
              background: "var(--border)",
              position: "relative"
            }}>
              <span style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "var(--card-bg)",
                padding: "0 12px",
                fontSize: "12px",
                color: "var(--secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Or
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Link Existing Work Order</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text"
                  className="form-input" 
                  placeholder="Enter Work Order ID (e.g., WO-1234)" 
                  value={existingId} 
                  onChange={(e)=>setExistingId(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button"
                  className="btn btn-secondary" 
                  onClick={linkExisting} 
                  disabled={!existingId.trim()}
                  style={{ opacity: !existingId.trim() ? 0.5 : 1 }}
                >
                  Link
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "var(--secondary)", marginTop: "4px" }}>
                Link to an existing work order in the system
              </p>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
