"use client";

import { useMemo } from "react";
import { useEquipment } from "@/store/useEquipment";
import { DepreciationChart } from "./DepreciationChart";

export function EquipmentDetailsDrawer({ id, isOpen, onClose, onAssign, onAdjust, onCreateWO, onMarkRetired }: { id: string | null; isOpen: boolean; onClose: ()=>void; onAssign: ()=>void; onAdjust: ()=>void; onCreateWO: ()=>void; onMarkRetired?: ()=>void }) {
  const { equipment, history } = useEquipment();
  const item = useMemo(()=> equipment.find(e=>e.id===id) || null, [equipment, id]);
  const logs = useMemo(()=> history.filter(h=>h.equipmentId===id).sort((a,b)=> new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime()), [history, id]);

  if (!isOpen || !item) return null;

  return (
    <>
      <div className="slide-over-overlay" onClick={onClose} />
      <aside className="slide-over" role="dialog" aria-modal>
        <div className="slide-over-header">
          <h2 className="slide-over-title">{item.name} — {item.sku}</h2>
          <button className="slide-over-close" onClick={onClose}>✕</button>
        </div>
        <div className="slide-over-body">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="dashboard-section">
                <h3 className="section-title">Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><div className="text-secondary">Category</div><div className="font-medium">{item.category}</div></div>
                  <div><div className="text-secondary">Serial</div><div className="font-medium">{item.serialNumber || '—'}</div></div>
                  <div><div className="text-secondary">Purchase Date</div><div className="font-medium">{item.purchaseDate || '—'}</div></div>
                  <div><div className="text-secondary">Supplier</div><div className="font-medium">{item.supplierId || '��'}</div></div>
                  <div><div className="text-secondary">Warranty</div><div className="font-medium">{item.warrantyExpiry || '—'}</div></div>
                  <div><div className="text-secondary">Location</div><div className="font-medium">{item.location || '—'}</div></div>
                </div>
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Audit History</h3>
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto text-sm">
                  {logs.length===0 ? <div className="text-secondary">No history</div> : logs.map(l => (
                    <div key={l.id} className="activity-item"><div className="flex justify-between"><span>{l.details}</span><span className="text-secondary text-xs">{new Date(l.timestamp).toLocaleString()}</span></div></div>
                  ))}
                </div>
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Maintenance Records</h3>
                <div className="text-sm text-secondary">Last maintenance: {item.lastMaintenanceAt ? new Date(item.lastMaintenanceAt).toLocaleString() : '—'}</div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="dashboard-section">
                <h3 className="section-title">Depreciation</h3>
                <DepreciationChart item={item} />
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Attachments</h3>
                <div className="grid grid-cols-3 gap-2">
                  {(item.images||[]).length===0? <div className="text-secondary text-sm">No images</div> : item.images!.map((src,idx)=> <img key={idx} src={src} alt="attachment" className="w-full h-16 object-cover rounded" />)}
                </div>
              </div>
              <div className="dashboard-section">
                <h3 className="section-title">Actions</h3>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-secondary" onClick={onAssign}>Assign</button>
                  <button className="btn btn-secondary" onClick={onAdjust}>Adjust Stock</button>
                  <button className="btn btn-secondary" onClick={onCreateWO}>Create Work Order</button>
                  <button className="btn btn-primary">Mark Retired</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
