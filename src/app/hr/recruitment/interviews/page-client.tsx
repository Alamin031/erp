"use client";

import { useEffect, useState } from 'react';
import { useInterviews } from './store/useInterviews';
import { InterviewsCalendar } from './components/InterviewsCalendar';
import { InterviewsTable } from './components/InterviewsTable';
import { InterviewersPanel } from './components/InterviewersPanel';
import { NewInterviewModal } from './components/NewInterviewModal';
import { InterviewDetailsDrawer } from './components/InterviewDetailsDrawer';
import { InterviewStatsCards } from './components/InterviewStatsCards';
import { ToastContainer, useToast } from '@/components/toast';

export function InterviewsPageClient() {
  const { loadDemoData, interviews } = useInterviews();
  const [openNew, setOpenNew] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(()=> { if (interviews.length === 0) loadDemoData(); }, [interviews.length, loadDemoData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Interviews</h1>
          <p className="dashboard-subtitle">Schedule and manage interviews with candidates</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=> setOpenNew(true)} className="px-3 py-2 rounded-xl bg-cyan-400 text-black">Schedule Interview</button>
        </div>
      </div>

      <InterviewStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
          <InterviewsCalendar onEventClick={(id)=> setSelectedId(id)} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
            <InterviewersPanel onAssign={(id)=> setOpenNew(true)} />
          </div>
        </aside>
      </div>

      <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
        <InterviewsTable onView={(id)=> setSelectedId(id)} />
      </div>

      <ToastContainer />

      {openNew && <NewInterviewModal open={openNew} onClose={()=> setOpenNew(false)} onSaved={()=> { setOpenNew(false); showToast({ title: 'Interview scheduled', type: 'success' }); }} />}

      {selectedId && <InterviewDetailsDrawer interviewId={selectedId} onClose={()=> setSelectedId(null)} />}
    </div>
  );
}
