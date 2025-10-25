"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSecurities } from "@/store/useSecurities";
import { newStockOptionSchema, NewStockOptionInput } from "@/lib/securities-validation";
import { useToast } from "@/components/toast";

export function NewStockOptionModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addStockOption } = useSecurities();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NewStockOptionInput>({
    resolver: zodResolver(newStockOptionSchema) as any,
    defaultValues: { status: "Active" },
  });

  const grantDate = watch("grantDate");

  if (!isOpen) return null;

  const onSubmit = async (data: NewStockOptionInput) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 200));

      const vestingEndDate = new Date(data.grantDate);
      vestingEndDate.setMonth(vestingEndDate.getMonth() + data.vestingPeriod);

      addStockOption({
        employeeName: data.employeeName,
        quantity: data.quantity,
        grantDate: data.grantDate,
        vestingPeriod: data.vestingPeriod,
        vestingSchedule: {
          totalShares: data.quantity,
          vestedShares: 0,
          vestingStartDate: data.grantDate,
          vestingEndDate: vestingEndDate.toISOString().split("T")[0],
          cliffMonths: 12,
          monthlyVestingPercent: 100 / data.vestingPeriod,
        },
        expiryDate: data.expiryDate,
        strikePrice: data.strikePrice,
        status: data.status,
      });
      showToast("Stock option granted successfully", "success");
      reset();
      onClose();
    } catch (e) {
      showToast((e as Error).message || "Failed to grant stock option", "error");
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
            <h2>Grant Stock Options</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          {/* Employee Name */}
          <div className="form-group">
            <label className="form-label">Employee Name *</label>
            <input className="form-input" {...register("employeeName")} placeholder="Full name" />
            {errors.employeeName && <p className="form-error">{errors.employeeName.message}</p>}
          </div>

          {/* Quantity and Strike Price */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input className="form-input" type="number" {...register("quantity")} placeholder="0" />
              {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Strike Price *</label>
              <input className="form-input" type="number" step="0.01" {...register("strikePrice")} placeholder="0.00" />
              {errors.strikePrice && <p className="form-error">{errors.strikePrice.message}</p>}
            </div>
          </div>

          {/* Grant Date and Vesting Period */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Grant Date *</label>
              <input className="form-input" type="date" {...register("grantDate")} />
              {errors.grantDate && <p className="form-error">{errors.grantDate.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Vesting Period (months) *</label>
              <input className="form-input" type="number" {...register("vestingPeriod")} placeholder="48" />
              {errors.vestingPeriod && <p className="form-error">{errors.vestingPeriod.message}</p>}
            </div>
          </div>

          {/* Expiry Date and Status */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiry Date *</label>
              <input className="form-input" type="date" {...register("expiryDate")} />
              {errors.expiryDate && <p className="form-error">{errors.expiryDate.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" {...register("status")}>
                <option value="Active">Active</option>
                <option value="Vested">Vested</option>
                <option value="Exercised">Exercised</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Granting..." : "Grant Options"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
