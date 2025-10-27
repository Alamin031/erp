"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useJobs } from '../store/useJobs';

export function JobDetailsDrawer({ jobId, onClose }: { jobId: string; onClose: () => void }) {
  const { jobs, recruiters } = useJobs();
  const job = jobs.find(j => j.id === jobId);
  if (!job) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed inset-y-0 right-0 w-full sm:w-[480px] z-50 bg-zinc-900 border-l border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h3 className="text-zinc-100 font-semibold">{job.title}</h3>
            <div className="text-zinc-400 text-sm">{job.department} • {job.employmentType}</div>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          <div className="space-y-2">
            <div className="text-zinc-300 text-sm">Recruiter</div>
            <div className="text-zinc-100">{recruiters.find(r=> r.id === job.recruiterId)?.name || 'Unassigned'}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Description</div>
            <div className="text-zinc-100">{job.description}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Required Skills</div>
            <div className="flex flex-wrap gap-2 mt-2">{(job.requiredSkills||[]).map((s,i)=> <span key={i} className="px-2 py-1 rounded-lg bg-zinc-800 text-zinc-100 text-xs">{s}</span>)}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Applicants</div>
            <div className="text-zinc-100">{job.applicants || 0}</div>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <div className="text-zinc-300 text-sm mb-2">Activity</div>
            <div className="text-zinc-400 text-sm">No activity yet (placeholder)</div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
