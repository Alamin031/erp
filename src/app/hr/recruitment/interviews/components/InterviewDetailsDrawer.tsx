"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useInterviews } from '../store/useInterviews';
import { useApplicants } from '../../applicants/store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';

export function InterviewDetailsDrawer({ interviewId, onClose }: { interviewId: string; onClose: ()=> void }) {
  const { interviews, interviewers } = useInterviews();
  const { applicants } = useApplicants();
  const { jobs } = useJobs();
  const it = interviews.find(i=> i.id === interviewId);
  if (!it) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed inset-y-0 right-0 w-full sm:w-[520px] z-50 bg-zinc-900 border-l border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div>
            <h3 className="text-zinc-100 font-semibold">{applicants.find(a=> a.id === it.applicantId)?.name}</h3>
            <div className="text-zinc-400 text-sm">{jobs.find(j=> j.id === it.jobId)?.title}</div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full">
          <div>
            <div className="text-zinc-300 text-sm">Interviewers</div>
            <div className="flex gap-2 mt-2">{it.interviewers.map(id => <div key={id} className="px-2 py-1 rounded bg-zinc-800 text-zinc-100 text-sm">{id}</div>)}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Agenda</div>
            <div className="text-zinc-100">{it.notes}</div>
          </div>

          <div>
            <div className="text-zinc-300 text-sm">Timeline</div>
            <div className="space-y-2 mt-2">{(it.timeline||[]).map(t=> <div key={t.id} className="text-zinc-400 text-sm">{t.type} • {t.text} • {new Date(t.at).toLocaleString()}</div>)}</div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
