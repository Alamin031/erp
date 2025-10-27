"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as z from 'zod';
import { useApplicants } from '../store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';
import { useJobs as useJobsTypes } from '../../jobs/types';
import { useJobs as useJobsStore } from '../../jobs/store/useJobs';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  jobId: z.string().optional(),
  source: z.string().optional(),
  appliedDate: z.string().optional(),
  recruiterId: z.string().optional(),
  stage: z.enum(['applied','shortlisted','interview','hired','rejected']).optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddApplicantModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved?: () => void }) {
  const { jobs } = useJobs();
  const { recruiters } = useJobsStore();
  const { addApplicant } = useApplicants();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { stage: 'applied' } });

  useEffect(()=> { if (!open) reset(); }, [open]);

  function onSubmit(values: FormValues) {
    const now = new Date().toISOString();
    addApplicant({ name: values.name, email: values.email, phone: values.phone, jobId: values.jobId, source: values.source, appliedDate: values.appliedDate || now, recruiterId: values.recruiterId || null, stage: values.stage || 'applied', status: 'active' });
    onSaved?.();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-zinc-100 font-semibold">Add Applicant</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Name</label>
              <input {...register('name')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              {errors.name && <div className="text-rose-400 text-xs">{String(errors.name.message)}</div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Email</label>
                <input {...register('email')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Phone</label>
                <input {...register('phone')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Job</label>
                <select {...register('jobId')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="">Select job</option>
                  {jobs.map(j=> <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Source</label>
                <select {...register('source')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Applied Date</label>
                <input type="date" {...register('appliedDate')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Recruiter</label>
                <select {...register('recruiterId')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="">Unassigned</option>
                  {recruiters.map(r=> <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Initial Stage</label>
              <select {...register('stage')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-zinc-700 text-zinc-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-3 py-2 rounded-xl bg-emerald-400 text-black">Add</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
