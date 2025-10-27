"use client";

import { useEffect, useState } from 'react';
import { useApplicants } from './store/useApplicants';
import { ApplicantStatsCards } from './components/ApplicantStatsCards';
import { ApplicantFiltersBar } from './components/ApplicantFiltersBar';
import { ApplicantSearchBar } from './components/ApplicantSearchBar';
import { ApplicantsTable } from './components/ApplicantsTable';
import { ApplicantDetailsDrawer } from './components/ApplicantDetailsDrawer';
import { AddApplicantModal } from './components/AddApplicantModal';
import { StagePipelineChart } from './components/StagePipelineChart';
import { ToastContainer, useToast } from '@/components/toast';

export function ApplicantsPageClient() {
  const { loadDemoData, applicants } = useApplicants();
  const { showToast, toasts, removeToast } = useToast();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);

  useEffect(()=> { if (applicants.length === 0) loadDemoData(); }, [applicants.length, loadDemoData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Applicants</h1>
          <p className="dashboard-subtitle">Manage job applications and applicant information</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=> setOpenAdd(true)} className="px-3 py-2 rounded-xl bg-violet-500 text-black">+ Add Applicant</button>
        </div>
      </div>

      <ApplicantStatsCards />

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ApplicantFiltersBar />
            <ApplicantSearchBar />
          </div>
          <StagePipelineChart />
        </div>

        <ApplicantsTable onRowClick={(id)=> setSelectedApplicant(id)} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {openAdd && <AddApplicantModal open={openAdd} onClose={()=> setOpenAdd(false)} onSaved={()=> { setOpenAdd(false); showToast('Applicant added'); }} />}

      {selectedApplicant && <ApplicantDetailsDrawer applicantId={selectedApplicant} onClose={()=> setSelectedApplicant(null)} />}
    </div>
  );
}
