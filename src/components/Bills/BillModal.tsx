"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Bill, BillAttachment, BillStatus } from "@/types/bills";

const schema = z
  .object({
    billNumber: z.string().min(1, "Required"),
    vendorName: z.string().min(1, "Required"),
    billDate: z.string().min(1, "Required"),
    dueDate: z.string().min(1, "Required"),
    amount: z.number().positive("Must be > 0"),
    status: z.enum(["Paid", "Pending", "Overdue", "Partial"] as [BillStatus, ...BillStatus[]]),
    notes: z.string().optional(),
    attachment: z.any().optional(),
  })
  .refine((d) => new Date(d.dueDate) >= new Date(d.billDate), {
    message: "Due date must be after bill date",
    path: ["dueDate"],
  });

export type BillFormInput = z.infer<typeof schema>;

interface Props {
  open: boolean;
  initial?: Bill | null;
  onClose: () => void;
  onSave: (input: BillFormInput & { attachmentFile?: File | null }) => void;
}

export function BillModal({ open, initial, onClose, onSave }: Props) {
  const [filePreview, setFilePreview] = useState<BillAttachment | null>(initial?.attachment ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<BillFormInput>({
    resolver: zodResolver(schema) as Resolver<BillFormInput>,
    defaultValues: initial
      ? { billNumber: initial.billNumber, vendorName: initial.vendorName, billDate: initial.billDate, dueDate: initial.dueDate, amount: initial.amount, status: initial.status, notes: initial.notes }
      : { billNumber: "", vendorName: "", billDate: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10), amount: 0, status: "Pending", notes: "" },
  });

  useEffect(() => {
    if (initial) {
      reset({ billNumber: initial.billNumber, vendorName: initial.vendorName, billDate: initial.billDate, dueDate: initial.dueDate, amount: initial.amount, status: initial.status, notes: initial.notes });
      setFilePreview(initial.attachment ?? null);
    } else {
      reset({ billNumber: "", vendorName: "", billDate: new Date().toISOString().slice(0, 10), dueDate: new Date().toISOString().slice(0, 10), amount: 0, status: "Pending", notes: "" });
      setFilePreview(null);
    }
  }, [initial, reset]);

  if (!open) return null;

  const onSubmit = (values: BillFormInput) => {
    const file = fileRef.current?.files?.[0] ?? null;
    onSave({ ...values, attachmentFile: file });
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setFilePreview(null);
      setValue("attachment", undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview({ name: file.name, type: file.type, dataUrl: String(reader.result) });
      setValue("attachment", file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <motion.div
        className="modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        style={{ maxWidth: 560 }}
      >
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>{initial ? "Edit Bill" : "Add Bill"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body" style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Bill Number" error={errors.billNumber?.message}>
              <input {...register("billNumber")} type="text" className="input" />
            </Field>
            <Field label="Vendor Name" error={errors.vendorName?.message}>
              <input {...register("vendorName")} type="text" className="input" />
            </Field>
            <Field label="Bill Date" error={errors.billDate?.message}>
              <input {...register("billDate")} type="date" className="input" />
            </Field>
            <Field label="Due Date" error={errors.dueDate?.message}>
              <input {...register("dueDate")} type="date" className="input" />
            </Field>
            <Field label="Amount" error={errors.amount?.message}>
              <input {...register("amount", { valueAsNumber: true })} type="number" step="0.01" min="0" className="input" />
            </Field>
            <Field label="Status" error={errors.status?.message}>
              <select {...register("status")} className="input">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Partial">Partial</option>
              </select>
            </Field>
          </div>

          <Field label="Attachment">
            <input ref={fileRef} type="file" accept="application/pdf,image/*" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
            {filePreview && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--secondary)' }}>{filePreview.name}</div>
            )}
          </Field>

          <Field label="Notes">
            <textarea {...register("notes")} className="input" rows={3} />
          </Field>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--secondary)' }}>{label}</label>
      {children}
      {error && <div style={{ color: '#b91c1c', fontSize: 12 }}>{error}</div>}
    </div>
  );
}
