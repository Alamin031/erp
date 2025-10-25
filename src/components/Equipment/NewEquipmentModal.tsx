"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEquipment } from "@/store/useEquipment";
import {
  equipmentFormSchema,
  EquipmentFormInput,
} from "@/lib/equipment-validation";
import { useToast } from "@/components/toast";

export function NewEquipmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { suppliers, addEquipment, loadDemoData } = useEquipment();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const createdUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    if (suppliers.length === 0) loadDemoData();
  }, [suppliers.length, loadDemoData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EquipmentFormInput>({
    resolver: zodResolver(equipmentFormSchema) as Resolver<EquipmentFormInput>,
    defaultValues: {
      quantity: 0,
      minStock: 0,
      depreciationMethod: "None",
      status: "Active",
    },
  });

  useEffect(() => {
    // cleanup created object URLs on unmount
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
    };
  }, []);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<EquipmentFormInput> = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
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
      // revoke created urls and clear
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
      setImages([]);
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to add", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => {
      const u = URL.createObjectURL(f);
      createdUrlsRef.current.push(u);
      return u;
    });
    setImages((prev) => [...prev, ...urls]);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ zIndex: 1001 }}>
        <div className="modal-card" style={{ maxWidth: "850px", maxHeight: "90vh", overflow: "auto" }}>
          <div className="modal-header">
            <h2>New Equipment</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" {...register("name")} />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input className="form-input" {...register("category")} />
                {errors.category && (
                  <p className="form-error">{errors.category.message}</p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input className="form-input" {...register("sku")} />
              </div>
              <div className="form-group">
                <label className="form-label">Serial No</label>
                <input className="form-input" {...register("serialNumber")} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input
                  type="date"
                  className="form-input"
                  {...register("purchaseDate")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Supplier</label>
                <select className="form-input" {...register("supplierId")}>
                  <option value="">-- None --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Purchase Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  {...register("purchasePrice")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Warranty Expiry</label>
                <input
                  type="date"
                  className="form-input"
                  {...register("warrantyExpiry")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" {...register("location")} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  className="form-input"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <p className="form-error">{errors.quantity.message}</p>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Min Stock Threshold *</label>
                <input
                  type="number"
                  className="form-input"
                  {...register("minStock")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Depreciation Method</label>
                <select
                  className="form-input"
                  {...register("depreciationMethod")}
                >
                  <option value="None">None</option>
                  <option value="Straight-line">Straight-line</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Depreciation Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  {...register("depreciationRate")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" {...register("status")}>
                  {["Active", "In Use", "Under Maintenance", "Retired"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                rows={2}
                {...register("notes")}
                style={{ resize: "vertical", minHeight: "60px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onFiles(e.target.files)
                }
                className="form-input"
                style={{ padding: "8px" }}
              />
              {images.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginTop: "12px" }}>
                  {images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt="preview"
                      style={{ width: "100%", height: "64px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)" }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Equipment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
