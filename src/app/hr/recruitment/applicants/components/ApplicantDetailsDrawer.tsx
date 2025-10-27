"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useApplicants } from '../store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';

export function ApplicantDetailsDrawer({ applicantId, onClose }: { applicantId: string; onClose: () => void }) {
  const { applicants, updateApplicant, deleteApplicant } = useApplicants();
  const { jobs, recruiters } = useJobs();
  const app = applicants.find(a => a.id === applicantId);
  if (!app) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed inset-y-0 right-0 w-full sm:w-[520px] z-50 bg-zinc-900 border-l border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h3 className="text-zinc-100 font-semibold">{app.name}</h3>
            <div className="text-zinc-400 text-sm">{jobs.find(j=> j.id === app.jobId)?.title || 'No job selected'}</div>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          <div className="space-y-2">
            <div className="text-zinc-300 text-sm">Contact</div>
            <div className="text-zinc-100">{app.email} • {app.phone}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Resume</div>
            <div className="text-zinc-100"><a href={app.resumeUrl || '#'} target="_blank" rel="noreferrer">View Resume</a></div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Stage</div>
            <div className="text-zinc-100">{app.stage}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Notes</div>
            <div className="space-y-2">{(app.notes||[]).map((n,i)=> <div key={i} className="p-2 bg-zinc-800 rounded">{n}</div>)}</div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button onClick={()=> { updateApplicant(applicantId, { stage: 'hired' }); alert('Send email placeholder'); }} className="px-3 py-2 rounded-xl bg-emerald-400 text-black mr-2">Mark Hired & Email</button>
            <button onClick={()=> { if (confirm('Delete applicant?')) { deleteApplicant(applicantId); onClose(); }}} className="px-3 py-2 rounded-xl bg-rose-500 text-black">Delete</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
