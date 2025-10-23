"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSecurities } from "@/store/useSecurities";
import { newSecuritySchema, NewSecurityInput } from "@/lib/securities-validation";
import { useToast } from "@/components/toast";

export function NewSecurityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addSecurity } = useSecurities();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewSecurityInput>({
    resolver: zodResolver(newSecuritySchema),
    defaultValues: { type: "Common", status: "Issued" },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: NewSecurityInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      addSecurity({
        holderName: data.holderName,
        type: data.type,
        shares: data.shares,
        value: data.value,
        issueDate: data.issueDate,
        status: data.status,
        documents: [],
        transactions: [],
      });
      showToast("Security added successfully", "success");
      reset();
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to add security", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Issue New Security</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Shareholder Name *</label>
              <input className="form-input" {...register("holderName")} placeholder="e.g., John Smith (Founder)" />
              {errors.holderName && <p className="form-error">{errors.holderName.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Type *</label>
              <select className="form-input" {...register("type")}>
                <option value="Common">Common</option>
                <option value="Preferred">Preferred</option>
                <option value="Convertible Note">Convertible Note</option>
              </select>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Shares Quantity *</label>
              <input className="form-input" type="number" {...register("shares")} placeholder="0" />
              {errors.shares && <p className="form-error">{errors.shares.message}</p>}
            </div>
            <div>
              <label className="form-label">Valuation (per share) *</label>
              <input className="form-input" type="number" step="0.01" {...register("value")} placeholder="0.00" />
              {errors.value && <p className="form-error">{errors.value.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Issue Date *</label>
              <input className="form-input" type="date" {...register("issueDate")} />
              {errors.issueDate && <p className="form-error">{errors.issueDate.message}</p>}
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                <option value="Issued">Issued</option>
                <option value="Active">Active</option>
                <option value="Vested">Vested</option>
                <option value="Transferred">Transferred</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Adding..." : "Add Security"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
