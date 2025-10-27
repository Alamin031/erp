"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as z from 'zod';
import { useJobs } from '../store/useJobs';
import { useToast } from '@/components/toast';

const schema = z.object({
  title: z.string().min(2),
  department: z.string().optional(),
  employmentType: z.enum(['Full-time','Part-time','Contract','Internship']).optional(),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  postingDate: z.string().optional(),
  closingDate: z.string().optional(),
  description: z.string().optional(),
  requiredSkills: z.string().optional(),
  recruiterId: z.string().optional(),
  status: z.enum(['draft','open','closed','expired','filled']).optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewJobModal({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved?: () => void }) {
  const { recruiters, createJob } = useJobs();
  const { showToast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { status: 'draft' } });

  useEffect(()=> { if (!open) reset(); }, [open]);

  function onSubmit(values: FormValues) {
    const skills = values.requiredSkills ? values.requiredSkills.split(',').map(s=> s.trim()).filter(Boolean) : [];
    createJob({ title: values.title, department: values.department, employmentType: values.employmentType, location: values.location, salaryRange: values.salaryRange, postingDate: values.postingDate, closingDate: values.closingDate, description: values.description, requiredSkills: skills, recruiterId: values.recruiterId || null, status: values.status || 'draft' });
    onSaved?.();
    showToast('Job created');
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="text-zinc-100 font-semibold">New Job Opening</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
            <div>
              <label className="block text-zinc-300 text-sm mb-1">Job Title</label>
              <input {...register('title')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              {errors.title && <div className="text-rose-400 text-xs">{String(errors.title.message)}</div>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Department</label>
                <input {...register('department')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Employment Type</label>
                <select {...register('employmentType')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="">Select</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Posting Date</label>
                <input type="date" {...register('postingDate')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Closing Date</label>
                <input type="date" {...register('closingDate')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Job Description</label>
              <textarea {...register('description')} rows={4} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
            </div>

            <div>
              <label className="block text-zinc-300 text-sm mb-1">Required Skills (comma separated)</label>
              <input {...register('requiredSkills')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Recruiter</label>
                <select {...register('recruiterId')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="">Unassigned</option>
                  {recruiters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-zinc-300 text-sm mb-1">Status</label>
                <select {...register('status')} className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100">
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="expired">Expired</option>
                  <option value="filled">Filled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-zinc-700 text-zinc-100">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-3 py-2 rounded-xl bg-emerald-400 text-black">Create</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
