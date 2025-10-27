"use client";

import { motion } from 'framer-motion';
import { useInterviews } from '../store/useInterviews';

export function InterviewStatsCards() {
  const { interviews } = useInterviews();
  const today = new Date().toISOString().slice(0,10);
  const stats = { today: interviews.filter(i=> i.date === today).length, weekCompleted: interviews.filter(i=> i.status === 'completed').length, noShows: interviews.filter(i=> i.status === 'no-show').length };

  const cards = [
    { label: 'Interviews Today', value: stats.today },
    { label: 'Completed This Week', value: stats.weekCompleted },
    { label: 'No-shows', value: stats.noShows },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {cards.map((c,i)=> (
        <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
          <div className="text-zinc-400 text-xs">{c.label}</div>
          <div className="text-zinc-100 font-semibold text-2xl mt-1">{c.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
