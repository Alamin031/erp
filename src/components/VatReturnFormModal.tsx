"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vatReturnSchema, type VatReturnInput } from "@/types/vat";
import { useVat } from "@/store/useVat";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  returnId?: string;
  onClose: () => void;
  onSubmit: (data: VatReturnInput) => void;
}

export function VatReturnFormModal({ open, returnId, onClose, onSubmit }: Props) {
  const { vatRate, vatReturns } = useVat();
  const defaultValues: VatReturnInput = {
    periodStart: new Date().toISOString().slice(0,10),
    periodEnd: new Date().toISOString().slice(0,10),
    taxableSales: 0,
    zeroRatedSales: 0,
    exemptSales: 0,
    outputVat: 0,
    inputVat: 0,
    adjustments: 0,
    credits: 0,
    penalties: 0,
  };
  const r = vatReturns.find(v => v.id === returnId);

  const schema = z.object({
    periodStart: z.string(),
    periodEnd: z.string(),
    taxableSales: z.number(),
    zeroRatedSales: z.number(),
    exemptSales: z.number(),
    outputVat: z.number(),
    inputVat: z.number(),
    adjustments: z.number(), // was .number().optional()
    credits: z.number(),     // was .number().optional()
    penalties: z.number(),   // was .number().optional()
  }).superRefine((val, ctx) => {
    const start = new Date(val.periodStart).getTime();
    const end = new Date(val.periodEnd).getTime();
    if (end < start) ctx.addIssue({ path: ['periodEnd'], code: z.ZodIssueCode.custom, message: 'End must be after start' });
    const overlaps = vatReturns.some(v => v.status === 'Filed' && ((new Date(v.periodStart).getTime() <= end) && (new Date(v.periodEnd).getTime() >= start)) && (!returnId || v.id !== returnId));
    if (overlaps) ctx.addIssue({ path: ['periodStart'], code: z.ZodIssueCode.custom, message: 'Overlaps with an existing filed return' });
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<VatReturnInput>({
    resolver: zodResolver(schema),
    defaultValues: r ? { ...r } : defaultValues,
  });

  useEffect(() => { if (r) reset(r); }, [r, reset]);

  // auto-calc outputVat as taxableSales * rate
  const taxableSales = watch('taxableSales');
  useEffect(() => { setValue('outputVat', Number(((taxableSales || 0) * vatRate).toFixed(2))); }, [taxableSales, vatRate, setValue]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-2xl mx-auto bg-[#18181b] rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
          <h3 className="text-xl font-bold text-gray-100">{returnId ? 'Edit VAT Return' : 'New VAT Return'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
  <form onSubmit={handleSubmit(onSubmit as (data: any) => void)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Row 1: Period Start | Period End */}
    <label className="form-label font-medium text-gray-200">Period Start
      <input type="date" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('periodStart')} />
      {errors.periodStart && <span className="form-error text-xs text-red-400">{errors.periodStart.message}</span>}
    </label>
    <label className="form-label font-medium text-gray-200">Period End
      <input type="date" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('periodEnd')} />
      {errors.periodEnd && <span className="form-error text-xs text-red-400">{errors.periodEnd.message}</span>}
    </label>

    {/* Row 2: Taxable Sales | Output VAT */}
    <label className="form-label font-medium text-gray-200">Taxable Sales
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('taxableSales', { valueAsNumber: true })} />
    </label>
    <label className="form-label font-medium text-gray-200">Output VAT
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('outputVat', { valueAsNumber: true })} />
    </label>

    {/* Row 3: Zero-rated Sales | Input VAT */}
    <label className="form-label font-medium text-gray-200">Zero-rated Sales
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('zeroRatedSales', { valueAsNumber: true })} />
    </label>
    <label className="form-label font-medium text-gray-200">Input VAT
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('inputVat', { valueAsNumber: true })} />
    </label>

    {/* Row 4: Exempt Sales | Adjustments */}
    <label className="form-label font-medium text-gray-200">Exempt Sales
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('exemptSales', { valueAsNumber: true })} />
    </label>
    <label className="form-label font-medium text-gray-200">Adjustments
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('adjustments', { valueAsNumber: true })} />
    </label>

    {/* Row 5: Credits | Penalties */}
    <label className="form-label font-medium text-gray-200">Credits
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('credits', { valueAsNumber: true })} />
    </label>
    <label className="form-label font-medium text-gray-200">Penalties
      <input type="number" step="0.01" className="form-input mt-1 bg-[#23232a] border-gray-700 text-gray-100 placeholder-gray-400" {...register('penalties', { valueAsNumber: true })} />
    </label>

    {/* Actions Row */}
    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-6">
      <button
        type="button"
        className="px-5 py-2 rounded-lg border border-gray-600 bg-[#23232a] text-gray-200 hover:bg-[#23232a]/80 hover:text-white transition font-semibold shadow-sm"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Save
      </button>
    </div>
  </form>
       
      </motion.div>
    </div>
  );
}
