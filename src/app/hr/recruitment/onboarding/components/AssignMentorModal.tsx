'use client';
import { useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useOnboarding } from '../store/useOnboarding';
import { useForm } from 'react-hook-form';

export function AssignMentorModal({ onboardingId, open, onClose }: { onboardingId: string; open: boolean; onClose: ()=>void }) {
  const { mentors, assignMentor, onboardings } = useOnboarding();
  const form = useForm<{ mentorId: string }>({ defaultValues: { mentorId: '' } });

  useEffect(()=> { const ob = onboardings.find(o=> o.id === onboardingId); if (ob && ob.mentorId) form.reset({ mentorId: ob.mentorId }); }, [onboardingId]);

  function onSubmit(vals: { mentorId: string }) {
    assignMentor(onboardingId, vals.mentorId);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black/60" aria-hidden />
        <div className="relative w-full max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 z-50">
          <Dialog.Title className="text-lg font-semibold text-neutral-100 mb-2">Assign Mentor</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="text-neutral-300 text-xs">Mentor</label>
              <select {...form.register('mentorId')} className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-100">
                <option value="">Select mentor</option>
                {mentors.map(m=> <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-emerald-600 text-white">Assign</button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
