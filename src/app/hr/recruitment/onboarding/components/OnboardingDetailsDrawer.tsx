'use client';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useOnboarding } from '../store/useOnboarding';
import { TaskChecklist } from './TaskChecklist';
import { AssignMentorModal } from './AssignMentorModal';
import { Download } from 'lucide-react';
import { useToast } from '@/components/toast';

export function OnboardingDetailsDrawer({ onboardingId, onClose }: { onboardingId: string; onClose: ()=>void }) {
  const { onboardings, selectOnboarding, assignMentor, markCompleted, updateOnboarding } = useOnboarding();
  const { showToast } = useToast();
  const ob = onboardings.find(o=> o.id === onboardingId);
  const [assignOpen, setAssignOpen] = useState(false);

  useEffect(()=> { if (!ob) selectOnboarding(null); }, [ob]);
  if (!ob) return null;

  function handleDownload() {
    // mock summary PDF download
    if (!ob) {
      showToast('No onboarding selected');
      return;
    }
    const content = `Onboarding Summary for ${ob.employeeName}\nStatus: ${ob.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ob.employeeName}-onboarding.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded summary');
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-end justify-end min-h-screen">
        <div aria-hidden="true" className="fixed inset-0 bg-black/40" />
        <div className="relative w-full max-w-xl bg-neutral-900 border-l border-neutral-800 p-6 z-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">{ob.employeeName}</h3>
              <p className="text-neutral-400 text-sm">{ob.department}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleDownload} className="text-zinc-300 hover:text-zinc-100"><Download className="h-4 w-4" /></button>
              <button onClick={onClose} className="text-zinc-400">Close</button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 border border-neutral-700 rounded-md p-3">
              <h4 className="text-neutral-200 text-sm font-medium">Mentor</h4>
              <div className="text-neutral-100 mt-2">{ob.mentorId || '-'}</div>
              <div className="mt-3"><button onClick={()=> setAssignOpen(true)} className="px-2 py-1 bg-emerald-600 rounded-md text-white">Assign Mentor</button></div>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 rounded-md p-3">
              <h4 className="text-neutral-200 text-sm font-medium">Progress</h4>
              <div className="text-neutral-100 mt-2">{Math.round(((ob.tasks.filter(t=> t.done).length)/(ob.tasks.length||1))*100)}%</div>
              <div className="text-neutral-400 text-sm mt-2">Start: {ob.startDate ? new Date(ob.startDate).toLocaleDateString() : '-'}</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-neutral-200 text-sm font-medium">Tasks</h4>
            <div className="mt-2"><TaskChecklist onboarding={ob} /></div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {ob.status !== 'completed' && <button onClick={()=> { markCompleted(ob.id); showToast('Onboarding marked completed'); }} className="px-3 py-2 rounded-md bg-emerald-600 text-white">Mark Completed</button>}
            <button onClick={()=> { updateOnboarding(ob.id, { status: 'not_started' }); showToast('Reopened'); }} className="px-3 py-2 rounded-md border border-neutral-700 text-neutral-200">Reopen</button>
          </div>

          {assignOpen && <AssignMentorModal onboardingId={ob.id} open={assignOpen} onClose={()=> setAssignOpen(false)} />}
        </div>
      </div>
    </Dialog>
  );
}
