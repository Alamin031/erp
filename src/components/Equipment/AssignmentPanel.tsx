"use client";

import { useState } from "react";
import { useEquipment } from "@/store/useEquipment";
import { useToast } from "@/components/toast";

export function AssignmentPanel({ isOpen, onClose, equipmentId }: { isOpen: boolean; onClose: ()=>void; equipmentId: string }) {
  const { equipment, assignEquipment } = useEquipment();
  const { showToast } = useToast();
  const item = equipment.find(e=>e.id===equipmentId) || null;
  const [assignee, setAssignee] = useState("");

  if (!isOpen || !item) return null;

  const save = () => {
    if (!assignee.trim()) return;
    assignEquipment(item.id, assignee.trim(), "Admin");
    showToast("Assigned", "success");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>Assign — {item.name}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <label className="form-label">Assign to (staff/room/project)</label>
          <input className="form-input" value={assignee} onChange={(e)=>setAssignee(e.target.value)} placeholder="e.g., Housekeeping or Room 305" />
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={!assignee.trim()}>Assign</button>
          </div>
        </div>
      </div>
    </>
  );
}
