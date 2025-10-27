'use client';
import { useMemo } from 'react';
import { useOnboarding } from '../store/useOnboarding';

export function OnboardingStatsCards() {
  const { onboardings } = useOnboarding();
  const stats = useMemo(() => {
    const total = onboardings.length;
    const inProgress = onboardings.filter(o=> o.status === 'in_progress').length;
    const completed = onboardings.filter(o=> o.status === 'completed').length;
    const overdue = onboardings.filter(o=> o.status === 'overdue').length;
    return { total, inProgress, completed, overdue };
  }, [onboardings]);

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="text-neutral-400 text-sm">Total Onboardings</div>
        <div className="text-neutral-100 text-2xl font-semibold">{stats.total}</div>
      </div>
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="text-neutral-400 text-sm">In Progress</div>
        <div className="text-neutral-100 text-2xl font-semibold">{stats.inProgress}</div>
      </div>
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="text-neutral-400 text-sm">Completed</div>
        <div className="text-neutral-100 text-2xl font-semibold">{stats.completed}</div>
      </div>
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="text-neutral-400 text-sm">Overdue</div>
        <div className="text-neutral-100 text-2xl font-semibold">{stats.overdue}</div>
      </div>
    </div>
  );
}
