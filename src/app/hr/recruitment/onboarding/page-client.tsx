"use client";

import { useEffect, useState } from 'react';
import { useOnboarding } from './store/useOnboarding';
import { OnboardingTable } from './components/OnboardingTable';
import { NewOnboardingModal } from './components/NewOnboardingModal';
import { OnboardingDetailsDrawer } from './components/OnboardingDetailsDrawer';
import { OnboardingProgressCard } from './components/OnboardingProgressCard';
import { OnboardingStatsCards } from './components/OnboardingStatsCards';
import { ToastContainer, useToast } from '@/components/toast';

export function OnboardingPageClient() {
  const { loadDemoData, onboardings, selectedId, selectOnboarding } = useOnboarding();
  const { showToast, toasts, removeToast } = useToast();
  const [openNew, setOpenNew] = useState(false);

  useEffect(() => { if (onboardings.length === 0) loadDemoData(); }, [onboardings.length, loadDemoData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-content">
        <div>
          <h1 className="dashboard-page-title">Onboarding</h1>
          <p className="dashboard-subtitle">Manage new employee onboarding processes and tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setOpenNew(true)} className="px-3 py-2 rounded-xl bg-emerald-500 text-black">+ New Onboarding</button>
        </div>
      </div>

      <OnboardingStatsCards />

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-zinc-400 text-sm">Filters</div>
        </div>

        <OnboardingTable onView={(id)=> selectOnboarding(id)} />
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {openNew && (
        <NewOnboardingModal
          open={openNew}
          onClose={() => setOpenNew(false)}
          onSaved={() => {
            setOpenNew(false);
            showToast('Onboarding created');
          }}
        />
      )}

      {selectedId && <OnboardingDetailsDrawer onboardingId={selectedId} onClose={() => selectOnboarding(null)} />}
    </div>
  );
}
