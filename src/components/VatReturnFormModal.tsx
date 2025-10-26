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

  const schema = vatReturnSchema.superRefine((val, ctx) => {
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
    <div className="modal" role="dialog" aria-modal="true">
      <motion.div className="modal-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{returnId ? 'Edit Return' : 'New VAT Return'}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="form-label">Period Start<input type="date" className="form-input" {...register('periodStart')} />{errors.periodStart && <span className="form-error">{errors.periodStart.message}</span>}</label>
          <label className="form-label">Period End<input type="date" className="form-input" {...register('periodEnd')} />{errors.periodEnd && <span className="form-error">{errors.periodEnd.message}</span>}</label>

          <label className="form-label">Taxable Sales<input type="number" step="0.01" className="form-input" {...register('taxableSales', { valueAsNumber: true })} /></label>
          <label className="form-label">Zero-rated Sales<input type="number" step="0.01" className="form-input" {...register('zeroRatedSales', { valueAsNumber: true })} /></label>
          <label className="form-label">Exempt Sales<input type="number" step="0.01" className="form-input" {...register('exemptSales', { valueAsNumber: true })} /></label>

          <label className="form-label">Output VAT<input type="number" step="0.01" className="form-input" {...register('outputVat', { valueAsNumber: true })} /></label>
          <label className="form-label">Input VAT<input type="number" step="0.01" className="form-input" {...register('inputVat', { valueAsNumber: true })} /></label>

          <label className="form-label">Adjustments<input type="number" step="0.01" className="form-input" {...register('adjustments', { valueAsNumber: true })} /></label>
          <label className="form-label">Credits<input type="number" step="0.01" className="form-input" {...register('credits', { valueAsNumber: true })} /></label>
          <label className="form-label">Penalties<input type="number" step="0.01" className="form-input" {...register('penalties', { valueAsNumber: true })} /></label>

          <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
