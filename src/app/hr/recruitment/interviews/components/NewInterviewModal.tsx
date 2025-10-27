"use client";

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useInterviews } from '../store/useInterviews';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';

const schema = z.object({
  applicantId: z.string().min(1),
  jobId: z.string().optional(),
  type: z.enum(['phone','video','onsite']).optional(),
  interviewers: z.array(z.string()).optional(),
  date: z.string().min(1),
  startTime: z.string().min(1),
  durationMins: z.coerce.number().min(15).max(240).optional(),
  location: z.string().optional(),
  round: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewInterviewModal({ open, editId, onClose, onSaved }: { open: boolean; editId?: string | null; onClose: ()=> void; onSaved?: ()=> void }) {
  const { interviews, scheduleInterview, updateInterview, interviewers } = useInterviews();
  const { applicants } = useApplicants();
  const { jobs } = useJobs();
  const editing = interviews.find(i=> i.id === editId);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { durationMins: 30, type: 'video' } as any });

  useEffect(()=> { if (editing) reset({ applicantId: editing.applicantId, jobId: editing.jobId, type: editing.type, interviewers: editing.interviewers, date: editing.date, startTime: editing.startTime, durationMins: editing.durationMins, location: editing.location, round: editing.round, notes: editing.notes }); }, [editId]);

  function onSubmit(values: FormValues) {
    if (editing) { updateInterview(editing.id, values as any); onSaved?.(); return; }
    scheduleInterview({ applicantId: values.applicantId, jobId: values.jobId, type: values.type as any, interviewers: values.interviewers || [], date: values.date, startTime: values.startTime, durationMins: values.durationMins || 30, location: values.location, round: values.round, notes: values.notes, status: 'scheduled' });
    onSaved?.();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-zinc-100 font-semibold">{editing ? 'Edit Interview' : 'Schedule Interview'}</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Candidate</label>
              <select {...register('applicantId')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                <option value="">Select applicant</option>
                {applicants.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Date</label>
                <input type="date" {...register('date')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Start Time</label>
                <input type="time" {...register('startTime')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Interviewers</label>
                <select multiple {...register('interviewers')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 h-28">
                  {interviewers.map(iv=> <option key={iv.id} value={iv.id}>{iv.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Duration (mins)</label>
                <input type="number" {...register('durationMins')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Round</label>
              <input {...register('round')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Location / Video Link</label>
              <input {...register('location')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Notes / Agenda</label>
              <textarea {...register('notes')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-zinc-700 text-zinc-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-3 py-2 rounded-xl bg-emerald-400 text-black">{editing ? 'Save' : 'Schedule'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
