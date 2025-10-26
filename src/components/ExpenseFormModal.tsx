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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur and dark background */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-0 border border-gray-800 animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 rounded-t-2xl bg-gray-950">
          <h2 className="text-2xl font-bold text-white">{defaultValues ? "Edit Expense" : "Submit Expense"}</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onClose}
            type="button"
            aria-label="Close form"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form className="px-6 py-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input {...register("title")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <input {...register("category")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`}
              />
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
              <input type="number" step="0.01" {...register("amount", { valueAsNumber: true })}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : ''}`}
              />
              {errors.amount && <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
              <input {...register("currency")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currency ? 'border-red-500' : ''}`}
              />
              {errors.currency && <p className="text-xs text-red-400 mt-1">{errors.currency.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <input type="date" {...register("date")}
                className={`w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
              <input {...register("vendor")}
                className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea {...register("notes")}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              className="px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
