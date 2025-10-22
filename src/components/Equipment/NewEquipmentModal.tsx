"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEquipment } from "@/store/useEquipment";
import { equipmentFormSchema, EquipmentFormInput } from "@/lib/equipment-validation";
import { useToast } from "@/components/toast";

export function NewEquipmentModal({ isOpen, onClose }: { isOpen: boolean; onClose: ()=>void }) {
  const { suppliers, addEquipment, loadDemoData } = useEquipment();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(()=>{ if (suppliers.length===0) loadDemoData(); }, [suppliers.length, loadDemoData]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EquipmentFormInput>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: { quantity: 0, minStock: 0, depreciationMethod: "None", status: "Active" }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: EquipmentFormInput) => {
    setIsSubmitting(true);
    try {
      await new Promise(r=>setTimeout(r,200));
      addEquipment({
        name: data.name,
        sku: data.sku || "",
        category: data.category,
        serialNumber: data.serialNumber,
        purchaseDate: data.purchaseDate,
        supplierId: data.supplierId,
        purchasePrice: data.purchasePrice,
        warrantyExpiry: data.warrantyExpiry,
        location: data.location,
        quantity: data.quantity,
        minStock: data.minStock,
        depreciationMethod: data.depreciationMethod,
        depreciationRate: data.depreciationRate,
        notes: data.notes,
        images: images,
        status: data.status as any,
        assignedTo: "",
        lastMaintenanceAt: undefined,
        linkedWorkOrderIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any);
      showToast("Equipment added", "success");
      reset();
      setImages([]);
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to add", "error");
    } finally { setIsSubmitting(false); }
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls]);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <h2>New Equipment</h2>
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
              <select className="form-input" {...register("supplierId")}>
                <option value="">-- None --</option>
                {suppliers.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
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

          <div>
            <label className="form-label">Images</label>
            <input type="file" accept="image/*" multiple onChange={(e)=>onFiles(e.target.files)} />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((src, idx)=> <img key={idx} src={src} alt="preview" className="w-full h-16 object-cover rounded" />)}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting?"Adding...":"Add Equipment"}</button>
          </div>
        </form>
      </div>
    </>
  );
}
