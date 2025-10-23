"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEquipment } from "@/store/useEquipment";
import { equipmentFormSchema, EquipmentFormInput } from "@/lib/equipment-validation";
import { Equipment } from "@/types/equipment";
import { useToast } from "@/components/toast";

export function EditEquipmentModal({ isOpen, onClose, equipment }: { isOpen: boolean; onClose: ()=>void; equipment: Equipment | null }) {
  const { updateEquipment } = useEquipment();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EquipmentFormInput>({
    resolver: zodResolver(equipmentFormSchema) as any,
  });

  useEffect(()=>{
    if (equipment) {
      reset({
        name: equipment.name,
        sku: equipment.sku,
        category: equipment.category,
        serialNumber: equipment.serialNumber,
        purchaseDate: equipment.purchaseDate,
        supplierId: equipment.supplierId,
        purchasePrice: equipment.purchasePrice,
        warrantyExpiry: equipment.warrantyExpiry,
        location: equipment.location,
        quantity: equipment.quantity,
        minStock: equipment.minStock,
        depreciationMethod: equipment.depreciationMethod,
        depreciationRate: equipment.depreciationRate,
        notes: equipment.notes,
        images: equipment.images,
        status: equipment.status,
      });
    }
  }, [equipment, reset]);

  if (!isOpen || !equipment) return null;

  const onSubmit = async (data: EquipmentFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(r=>setTimeout(r,200));
      updateEquipment(equipment.id, { ...data });
      showToast("Equipment updated", "success");
      onClose();
    } catch {
      showToast("Failed to update", "error");
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <h2>Edit Equipment</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Name *</label>
              <input className="form-input" {...register("name")} />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Category *</label>
              <input className="form-input" {...register("category")} />
              {errors.category && <p className="form-error">{errors.category.message}</p>}
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">SKU</label>
              <input className="form-input" {...register("sku")} />
            </div>
            <div>
              <label className="form-label">Serial No</label>
              <input className="form-input" {...register("serialNumber")} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Purchase Date</label>
              <input type="date" className="form-input" {...register("purchaseDate")} />
            </div>
            <div>
              <label className="form-label">Supplier</label>
              <input className="form-input" {...register("supplierId")} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Purchase Price</label>
              <input type="number" step="0.01" className="form-input" {...register("purchasePrice")} />
            </div>
            <div>
              <label className="form-label">Warranty Expiry</label>
              <input type="date" className="form-input" {...register("warrantyExpiry")} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Location</label>
              <input className="form-input" {...register("location")} />
            </div>
            <div>
              <label className="form-label">Quantity *</label>
              <input type="number" className="form-input" {...register("quantity")} />
              {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Min Stock Threshold *</label>
              <input type="number" className="form-input" {...register("minStock")} />
            </div>
            <div>
              <label className="form-label">Depreciation Method</label>
              <select className="form-input" {...register("depreciationMethod")}>
                <option>None</option>
                <option>Straight-line</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Depreciation Rate (%)</label>
              <input type="number" className="form-input" {...register("depreciationRate")} />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                {['Active','In Use','Under Maintenance','Retired'].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" rows={2} {...register("notes")} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting?"Saving...":"Save Changes"}</button>
          </div>
        </form>
      </div>
    </>
  );
}
