"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { z } from "zod";
import { usePlanning } from "@/store/usePlanning";

const schema = z.object({
  employeeId: z.string().min(1),
  department: z.string().optional(),
  role: z.string().optional(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ShiftAssignmentModal({ open, editId, onClose, onSaved }: { open: boolean; editId?: string | null; onClose: () => void; onSaved?: () => void }) {
  const { employees, shifts, assignShift, updateShift } = usePlanning();
  const editing = shifts.find(s => s.id === editId);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: editing ? { employeeId: editing.employeeId, department: editing.department, role: editing.role, date: editing.date, startTime: editing.startTime, endTime: editing.endTime, notes: editing.notes } : { employeeId: '', department: '', role: '', date: '', startTime: '', endTime: '', notes: '' } });

  useEffect(()=> { if (editing) reset({ employeeId: editing.employeeId, department: editing.department, role: editing.role, date: editing.date, startTime: editing.startTime, endTime: editing.endTime, notes: editing.notes }); }, [editId]);

  function onSubmit(values: FormValues) {
    if (editing) { updateShift(editing.id, values); onSaved?.(); return; }
    assignShift({ ...values });
    onSaved?.();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-lg rounded-2xl bg-zinc-800/90 border border-zinc-700 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-700">
            <h3 className="text-zinc-100 font-semibold">{editing ? 'Edit Shift' : 'Assign Shift'}</h3>
            <button aria-label="Close" onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Employee</label>
              <select {...register('employeeId')} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100">
                <option value="">Select</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name} • {e.department}</option>)}
              </select>
              {errors.employeeId && <div className="text-rose-400 text-xs">{String(errors.employeeId.message)}</div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Date</label>
                <input type="date" {...register('date')} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Role</label>
                <input {...register('role')} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Start</label>
                <input type="time" {...register('startTime')} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">End</label>
                <input type="time" {...register('endTime')} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-zinc-700 text-zinc-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-3 py-2 rounded-xl bg-emerald-500 text-black">{editing ? 'Save' : 'Assign'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
