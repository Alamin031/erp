"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useInterviews } from '../store/useInterviews';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const schema = z.object({ date: z.string().min(1), startTime: z.string().min(1), reason: z.string().optional() });

type FormValues = z.infer<typeof schema>;

export function RescheduleModal({ open, interviewId, onClose, onSaved }: { open: boolean; interviewId: string; onClose: ()=> void; onSaved?: ()=> void }) {
  const { rescheduleInterview, interviews } = useInterviews();
  const editing = interviews.find(i=> i.id === interviewId);
  const { register, handleSubmit, reset } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!open) return null;

  function onSubmit(values: FormValues) {
    rescheduleInterview(interviewId, values.date, values.startTime);
    onSaved?.();
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-zinc-100 font-semibold">Reschedule Interview</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-zinc-300 text-sm">Date</label>
              <input type="date" {...register('date')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
            </div>
            <div>
              <label className="text-zinc-300 text-sm">Start Time</label>
              <input type="time" {...register('startTime')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
            </div>
            <div>
              <label className="text-zinc-300 text-sm">Reason</label>
              <input {...register('reason')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-3 py-2 rounded-xl bg-emerald-400 text-black">Reschedule</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
