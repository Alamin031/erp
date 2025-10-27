'use client';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';
import { useOffers } from '../store/useOffers';
import { useToast } from '@/components/toast';
import { Download, Upload } from 'lucide-react';

const OfferSchema = z.object({
  id: z.string().optional(),
  applicantId: z.string().min(1, 'Candidate required'),
  jobId: z.string().min(1, 'Job required'),
  templateId: z.string().optional(),
  baseSalary: z.number().min(0).optional(),
  bonuses: z.string().optional(),
  benefits: z.string().optional(),
  joiningDate: z.string().min(1, 'Joining date required'),
  expiryDate: z.string().min(1, 'Expiry date required'),
  notes: z.string().optional(),
});

type OfferForm = z.infer<typeof OfferSchema> & { attachment?: File | null };

export function NewOfferModal({ open, onClose, onSaved }: { open: boolean; onClose: ()=>void; onSaved?: ()=>void }) {
  const { applicants, loadDemoData } = useApplicants();
  const { jobs, loadDemoData: loadJobs } = useJobs();
  const { createOffer, updateOffer, offers, selectedOfferId, selectOffer } = useOffers();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const form = useForm<OfferForm>({ resolver: zodResolver(OfferSchema), defaultValues: { applicantId: '', jobId: '', templateId: '', baseSalary: undefined, bonuses: '', benefits: '', joiningDate: '', expiryDate: '', notes: '' } });

  useEffect(()=> { if (applicants.length === 0) loadDemoData(); if (jobs.length === 0) loadJobs(); if (selectedOfferId) {
    const o = offers.find(x=> x.id === selectedOfferId);
    if (o) {
      form.reset({ id: o.id, applicantId: o.applicantId, jobId: o.jobId || '', templateId: o.templateId || '', baseSalary: o.baseSalary, bonuses: o.bonuses, benefits: o.benefits, joiningDate: o.joiningDate || '', expiryDate: o.expiryDate || '', notes: o.notes || '' });
    }
  } }, [applicants.length, jobs.length, selectedOfferId]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAttachmentName(f.name);
    // read as data url for demo storage
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // attach to form via stateful save when saving
      (form.setValue as any)('attachment', f);
      (form as any).attachmentData = dataUrl;
    };
    reader.readAsDataURL(f);
  }

  function onSubmit(values: OfferForm & { attachment?: any }) {
    setLoading(true);
    try {
      const payload: any = { ...values };
      if ((form as any).attachmentData) {
        payload.attachments = [{ id: 'att-' + Date.now(), name: attachmentName, url: (form as any).attachmentData, mime: (form as any).attachment?.type }];
      }
      if (values.id) updateOffer(values.id, payload);
      else createOffer(payload);
      showToast('Offer saved');
      onSaved?.();
      selectOffer(null);
    } catch (e) { showToast('Failed to save offer'); }
    setLoading(false);
  }

  function preview() {
    const vals = form.getValues();
    showToast('Preview opened');
    // open preview modal could be implemented; for now just notify
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <div aria-hidden className="fixed inset-0 bg-black/60" />
        <div className="relative w-full max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50">
          <Dialog.Title className="text-lg font-semibold text-zinc-100 mb-2">New Offer</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 text-xs">Candidate</label>
                <select {...form.register('applicantId')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100">
                  <option value="">Select candidate</option>
                  {applicants.map(a=> <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                {form.formState.errors.applicantId && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.applicantId.message}</div>}
              </div>

              <div>
                <label className="text-zinc-300 text-xs">Job Position</label>
                <select {...form.register('jobId')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100">
                  <option value="">Select job</option>
                  {jobs.map(j=> <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
                {form.formState.errors.jobId && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.jobId.message}</div>}
              </div>

              <div>
                <label className="text-zinc-300 text-xs">Base Salary</label>
                <input type="number" step="0.01" {...form.register('baseSalary', { valueAsNumber: true })} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100" />
              </div>

              <div>
                <label className="text-zinc-300 text-xs">Bonuses</label>
                <input {...form.register('bonuses')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100" />
              </div>

              <div>
                <label className="text-zinc-300 text-xs">Joining Date</label>
                <input type="date" {...form.register('joiningDate')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100" />
                {form.formState.errors.joiningDate && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.joiningDate.message}</div>}
              </div>

              <div>
                <label className="text-zinc-300 text-xs">Expiry Date</label>
                <input type="date" {...form.register('expiryDate')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100" />
                {form.formState.errors.expiryDate && <div className="text-rose-400 text-xs mt-1">{form.formState.errors.expiryDate.message}</div>}
              </div>
            </div>

            <div>
              <label className="text-zinc-300 text-xs">Notes / Clauses</label>
              <textarea {...form.register('notes')} className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-zinc-100 h-24" />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-zinc-300 text-xs">Attachment</label>
              <input type="file" accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
              {attachmentName && <div className="text-zinc-400 text-sm flex items-center gap-2"><Download className="h-4 w-4" />{attachmentName}</div>}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-md border border-zinc-700 text-zinc-200">Cancel</button>
              <button type="button" onClick={preview} className="px-3 py-2 rounded-md border border-zinc-700 text-zinc-200">Preview</button>
              <button type="submit" className="px-3 py-2 rounded-md bg-zinc-700 text-zinc-100">Save Draft</button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
