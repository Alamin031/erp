"use client";

import { motion } from 'framer-motion';
import { useApplicants } from '../store/useApplicants';

export function ApplicantStatsCards() {
  const { getStageStats } = useApplicants();
  const s = getStageStats();
  const cards = [
    { label: 'Total Applicants', value: s.total },
    { label: 'Shortlisted', value: s.shortlisted },
    { label: 'Interviews', value: s.interviewScheduled },
    { label: 'Hired', value: s.hired },
    { label: 'Rejected', value: s.rejected },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
      {cards.map((c,i)=> (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
          <div className="text-zinc-400 text-xs">{c.label}</div>
          <div className="text-zinc-100 font-semibold text-2xl mt-1">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
