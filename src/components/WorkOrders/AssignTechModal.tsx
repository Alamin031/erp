"use client";

import { useState } from "react";
import { useWorkOrders } from "@/store/useWorkOrders";
import { useToast } from "@/components/toast";

export function AssignTechModal({ isOpen, onClose, workOrderId }: { isOpen: boolean; onClose: () => void; workOrderId: string }) {
  const { technicians, assignTechnician } = useWorkOrders();
  const { showToast } = useToast();
  const [selected, setSelected] = useState("");
  const [eta, setEta] = useState("");
  const [notify, setNotify] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selected) return;
    assignTechnician(workOrderId, selected);
    showToast("Technician assigned", "success");
    if (notify) showToast("Tech notified (demo)", "info");
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h2>Assign Technician</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-form">
          <label className="form-label">Select Technician</label>
          <select className="form-input" value={selected} onChange={(e)=>setSelected(e.target.value)}>
            <option value="">-- Choose --</option>
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.skills.join(", ")})</option>
            ))}
          </select>

          <label className="form-label">ETA (optional)</label>
          <input className="form-input" type="datetime-local" value={eta} onChange={(e)=>setEta(e.target.value)} />

          <label className="inline-flex items-center gap-2 mt-2 text-sm"><input type="checkbox" checked={notify} onChange={(e)=>setNotify(e.target.checked)} /> Notify technician</label>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!selected}>Assign</button>
          </div>
        </div>
      </div>
    </>
  );
}
