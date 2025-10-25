"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSecurities } from "@/store/useSecurities";
import { newSecuritySchema, NewSecurityInput } from "@/lib/securities-validation";
import { useToast } from "@/components/toast";
import { Security } from "@/types/securities";

export function NewSecurityModal({ isOpen, onClose, security }: { isOpen: boolean; onClose: () => void; security?: Security | null }) {
  const { addSecurity, updateSecurity } = useSecurities();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewSecurityInput>({
    resolver: zodResolver(newSecuritySchema) as Resolver<NewSecurityInput>,
    defaultValues: { type: "Common", status: "Issued" },
  });

  // Prefill form when editing
  useEffect(() => {
    if (security) {
      reset({
        holderName: security.holderName,
        type: security.type,
        shares: security.shares,
        value: security.value,
        issueDate: security.issueDate?.split("T")?.[0] || security.issueDate,
        status: security.status,
      });
    } else if (isOpen) {
      // reset to defaults when opening create modal
      reset({ type: "Common", status: "Issued" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [security, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: NewSecurityInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
      if (security) {
        // update
        updateSecurity(security.id, {
          holderName: data.holderName,
          type: data.type,
          shares: data.shares,
          value: data.value,
          issueDate: data.issueDate,
          status: data.status,
        });
        showToast("Security updated successfully", "success");
        onClose();
      } else {
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
      }
    } catch (e) {
      showToast((e as Error).message || "Failed to add security", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-card" style={{ maxWidth: "650px" }}>
          <div className="modal-header">
            <h2>{security ? "Edit Security" : "Issue New Security"}</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            {/* Shareholder Name */}
            <div className="form-group">
              <label className="form-label">Shareholder Name *</label>
              <input 
                className="form-input" 
                {...register("holderName")} 
                placeholder="Employee Stock Plan - Vesting" 
              />
              {errors.holderName && <p className="form-error">{errors.holderName.message}</p>}
            </div>

            {/* Type and Shares Quantity */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type *</label>
                <select className="form-input" {...register("type")}>
                  <option value="Common">Common</option>
                  <option value="Preferred">Preferred</option>
                  <option value="Convertible Note">Convertible Note</option>
                </select>
                {errors.type && <p className="form-error">{errors.type.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Shares Quantity *</label>
                <input 
                  className="form-input" 
                  type="number" 
                  {...register("shares", { valueAsNumber: true })} 
                  placeholder="200000" 
                />
                {errors.shares && <p className="form-error">{errors.shares.message}</p>}
              </div>
            </div>

            {/* Valuation and Issue Date */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Valuation (per share) *</label>
                <input 
                  className="form-input" 
                  type="number" 
                  step="0.01" 
                  {...register("value", { valueAsNumber: true })} 
                  placeholder="1.5" 
                />
                {errors.value && <p className="form-error">{errors.value.message}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Issue Date *</label>
                <input 
                  className="form-input" 
                  type="date" 
                  {...register("issueDate")} 
                />
                {errors.issueDate && <p className="form-error">{errors.issueDate.message}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                <option value="Vested">Vested</option>
                <option value="Issued">Issued</option>
                <option value="Active">Active</option>
                <option value="Transferred">Transferred</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? (security ? "Updating..." : "Adding...") : security ? "Update Security" : "Add Security"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
