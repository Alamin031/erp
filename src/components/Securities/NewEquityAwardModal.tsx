"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSecurities } from "@/store/useSecurities";
import { newEquityAwardSchema, NewEquityAwardInput } from "@/lib/securities-validation";
import { useToast } from "@/components/toast";

export function NewEquityAwardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addEquityAward } = useSecurities();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(newEquityAwardSchema),
    defaultValues: { awardType: "RSU", status: "Pending" },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: NewEquityAwardInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));

      addEquityAward({
        employeeName: data.employeeName,
        awardType: data.awardType,
        quantity: data.quantity,
        vestingDate: data.vestingDate,
        status: data.status,
      });
      showToast("Equity award granted successfully", "success");
      reset();
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to grant equity award", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <h2>Grant Equity Award</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <div className="form-row">
            <div>
              <label className="form-label">Employee Name *</label>
              <input className="form-input" {...register("employeeName")} placeholder="Full name" />
              {errors.employeeName && <p className="form-error">{errors.employeeName.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Award Type *</label>
              <select className="form-input" {...register("awardType")}>
                <option value="RSU">Restricted Stock Units (RSU)</option>
                <option value="Bonus">Performance Bonus</option>
                <option value="Performance">Performance Award</option>
              </select>
              {errors.awardType && <p className="form-error">{errors.awardType.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Quantity *</label>
              <input className="form-input" type="number" {...register("quantity")} placeholder="0" />
              {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="form-label">Vesting Date *</label>
              <input className="form-input" type="date" {...register("vestingDate")} />
              {errors.vestingDate && <p className="form-error">{errors.vestingDate.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Vested">Vested</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Granting..." : "Grant Award"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
