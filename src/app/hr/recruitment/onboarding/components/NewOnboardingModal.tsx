'use client';
import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useOnboarding } from '../store/useOnboarding';

const OnboardingSchema = z.object({
  employeeName: z.string().min(1, 'Name required'),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  startDate: z.string().min(1, 'Start date required'),
  mentorId: z.string().min(1, 'Mentor required'),
  notes: z.string().optional(),
});

type OnboardingForm = z.infer<typeof OnboardingSchema> & { attachments?: FileList | null };

export function NewOnboardingModal({ open, onClose, onSaved }: { open: boolean; onClose: ()=>void; onSaved?: ()=>void }) {
  const { applicants, loadDemoData } = useApplicants();
  const { mentors, addOnboarding, loadDemoData: loadOnboardingDemo, selectedId, selectOnboarding } = useOnboarding();

  const form = useForm<OnboardingForm>({ resolver: zodResolver(OnboardingSchema), defaultValues: { employeeName: '', employeeId: '', department: '', startDate: '', mentorId: '', notes: '' } });

  useEffect(()=> { if (applicants.length === 0) loadDemoData(); if (mentors.length === 0) loadOnboardingDemo(); }, []);

  function onSubmit(values: OnboardingForm) {
    const payload = { ...values, tasks: [], attachments: [] };
    addOnboarding(payload);
    onSaved?.();
    onClose();
    selectOnboarding(null);
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <div className="relative w-full max-w-2xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 z-50">
          <Dialog.Title className="text-lg font-semibold text-neutral-100 mb-2">New Onboarding</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 text-xs">Employee Name</label>
                <input {...form.register('employeeName')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100" />
                {form.formState.errors.employeeName && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.employeeName.message}</div>}
              </div>
              <div>
                <label className="text-neutral-300 text-xs">Department</label>
                <input {...form.register('department')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100" />
              </div>
              <div>
                <label className="text-neutral-300 text-xs">Start Date</label>
                <input type="date" {...form.register('startDate')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100" />
                {form.formState.errors.startDate && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.startDate.message}</div>}
              </div>
              <div>
                <label className="text-neutral-300 text-xs">Assigned Mentor</label>
                <select {...form.register('mentorId')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100">
                  <option value="">Select mentor</option>
                  {mentors.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {form.formState.errors.mentorId && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.mentorId.message}</div>}
              </div>
            </div>

            <div>
              <label className="text-neutral-300 text-xs">Notes</label>
              <textarea {...form.register('notes')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100 h-24" />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-emerald-600 text-white">Create Onboarding</button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
