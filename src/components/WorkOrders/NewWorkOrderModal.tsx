"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkOrders } from "@/store/useWorkOrders";
import { workOrderFormSchema, WorkOrderFormInput } from "@/lib/workorder-validation";
import { useToast } from "@/components/toast";

export function NewWorkOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { assets, technicians, createWorkOrder, loadDemoData } = useWorkOrders();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(()=>{ if (assets.length===0 || technicians.length===0) loadDemoData(); }, [assets.length, technicians.length, loadDemoData]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<WorkOrderFormInput>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: { priority: "Medium" }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: WorkOrderFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(r=>setTimeout(r,200));
      createWorkOrder({
        title: data.title,
        description: data.description,
        assetId: data.assetId,
        assetName: data.assetName,
        assetType: data.assetType,
        requestedBy: data.requestedBy,
        priority: data.priority,
        dueAt: data.dueAt,
        assignedTechId: data.assignedTechId,
        attachments: data.attachments || [],
      } as any);
      showToast("Work order created", "success");
      reset();
      onClose();
    } catch (e) {
      showToast("Failed to create", "error");
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2>New Work Order</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Title *</label>
              <input className="form-input" {...register("title")} />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
            <div>
              <label className="form-label">Requested By *</label>
              <input className="form-input" placeholder="Staff/Guest" {...register("requestedBy")} />
              {errors.requestedBy && <p className="form-error">{errors.requestedBy.message}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Detailed Description *</label>
            <textarea className="form-textarea" rows={3} {...register("description")} />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Asset / Room</label>
              <select className="form-input" {...register("assetId")}>
                <option value="">-- None --</option>
                {assets.map(a => (<option key={a.id} value={a.id}>{a.name}{a.roomNumber?` (Room ${a.roomNumber})`:''}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">Priority *</label>
              <select className="form-input" {...register("priority")}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">SLA / Due Date & Time</label>
              <input type="datetime-local" className="form-input" {...register("dueAt")} />
            </div>
            <div>
              <label className="form-label">Assign Technician (optional)</label>
              <select className="form-input" {...register("assignedTechId")}>
                <option value="">-- Unassigned --</option>
                {technicians.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting?"Creating...":"Create"}</button>
          </div>
        </form>
      </div>
    </>
  );
}
