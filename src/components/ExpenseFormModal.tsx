"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseFormSchema, ExpenseFormData } from "@/lib/expenses-validation";
import { useToast } from "@/components/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  defaultValues?: Partial<ExpenseFormData>;
}

export function ExpenseFormModal({ open, onClose, onSave, defaultValues }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExpenseFormData>({ resolver: zodResolver(expenseFormSchema) });
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      reset(defaultValues || { title: "", category: "", amount: 0, currency: "BDT", date: new Date().toISOString().split("T")[0], receipts: [] });
    }
  }, [open, defaultValues, reset]);

  if (!open) return null;

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      await new Promise((r) => setTimeout(r, 200));
      onSave({ ...data, id: `exp-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), submitterId: "current-user", status: "Pending" });
    } catch (e) {
      showToast("Failed to save", "error");
    }
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card">
        <div className="modal-header">
          <h2>{defaultValues ? "Edit Expense" : "Submit Expense"}</h2>
        </div>
        <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Title</label>
              <input {...register("title")} className="form-input" />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>
            <div>
              <label className="form-label">Category</label>
              <input {...register("category")} className="form-input" />
              {errors.category && <p className="form-error">{errors.category.message}</p>}
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} className="form-input" />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="form-label">Currency</label>
              <input {...register("currency")} className="form-input" />
              {errors.currency && <p className="form-error">{errors.currency.message}</p>}
            </div>
            <div>
              <label className="form-label">Date</label>
              <input type="date" {...register("date")} className="form-input" />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
            <div>
              <label className="form-label">Vendor</label>
              <input {...register("vendor")} className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea {...register("notes")} className="form-input" rows={3} />
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
