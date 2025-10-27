"use client";

import { useEffect, useState } from 'react';
import { useJobs } from './store/useJobs';
import { JobStatsCards } from './components/JobStatsCards';
import { DepartmentFilterBar } from './components/DepartmentFilterBar';
import { SearchBar } from './components/SearchBar';
import { JobOpeningsTable } from './components/JobOpeningsTable';
import { JobDetailsDrawer } from './components/JobDetailsDrawer';
import { NewJobModal } from './components/NewJobModal';
import { AnalyticsChart } from './components/AnalyticsChart';
import { ToastContainer, useToast } from '@/components/toast';

export function JobsPageClient() {
  const { loadDemoData, jobs } = useJobs();
  const [openNew, setOpenNew] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => { if (jobs.length === 0) loadDemoData(); }, [jobs.length, loadDemoData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Job Openings</h1>
          <p className="dashboard-subtitle">Post and manage job openings for recruitment</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenNew(true)} className="px-3 py-2 rounded-xl bg-violet-500 text-black">+ New Job Opening</button>
        </div>
      </div>

      <JobStatsCards />

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DepartmentFilterBar />
            <SearchBar />
          </div>
          <AnalyticsChart />
        </div>

        <JobOpeningsTable onRowClick={(id)=> setSelectedJob(id)} />
      </div>

      <ToastContainer />

      {openNew && <NewJobModal open={openNew} onClose={() => setOpenNew(false)} onSaved={() => { setOpenNew(false); showToast({ title: 'Job created', type: 'success' }); }} />}

      {selectedJob && <JobDetailsDrawer jobId={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
