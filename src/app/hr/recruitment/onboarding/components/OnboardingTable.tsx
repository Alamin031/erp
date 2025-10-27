'use client';
import { useMemo, useState } from 'react';
import { useOnboarding } from '../store/useOnboarding';
import { useApplicants } from '../../applicants/store/useApplicants';
import { AssignMentorModal } from './AssignMentorModal';
import { Download, UserPlus, Trash2 } from 'lucide-react';
import { exportToCsv } from '@/lib/export';
import { useToast } from '@/components/toast';

export function OnboardingTable({ onView }: { onView?: (id:string)=>void }) {
  const { onboardings, selectOnboarding, archiveOnboarding, filterOnboardings, markCompleted } = useOnboarding();
  const { applicants } = useApplicants();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);

  const rows = useMemo(() => onboardings.slice(), [onboardings]);

  function toggleAll() { setSelected(s => s.length === rows.length ? [] : rows.map(r=> r.id)); }
  function toggle(id:string) { setSelected(s => s.includes(id) ? s.filter(x=> x!==id) : [...s, id]); }

  function markAllCompleted() {
    selected.forEach(id => markCompleted(id));
    showToast({ title: 'Marked selected as completed', type: 'success' });
  }

  function handleExport() { exportToCsv(rows, 'onboardings.csv'); showToast({ title: 'Export started', type: 'success' }); }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={toggleAll} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100">Toggle</button>
          <button onClick={markAllCompleted} className="px-2 py-1 bg-emerald-600 rounded-md text-white">Mark All Completed</button>
          <button onClick={handleExport} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100">Export CSV</button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-zinc-400 text-xs">
            <tr>
              <th className="px-3 py-2"><input type="checkbox" onChange={toggleAll} checked={selected.length === rows.length && rows.length>0} /></th>
              <th className="px-3 py-2 text-left">Employee</th>
              <th className="px-3 py-2 text-left">Department</th>
              <th className="px-3 py-2 text-left">Start Date</th>
              <th className="px-3 py-2 text-left">Mentor</th>
              <th className="px-3 py-2 text-left">Progress</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-800/40">
                <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(r.id)} onChange={()=> toggle(r.id)} /></td>
                <td className="px-3 py-2 text-zinc-100 cursor-pointer" onClick={()=> onView?.(r.id)}>{r.employeeName}</td>
                <td className="px-3 py-2 text-zinc-300">{r.department || '-'}</td>
                <td className="px-3 py-2 text-zinc-300">{r.startDate ? new Date(r.startDate).toLocaleDateString() : '-'}</td>
                <td className="px-3 py-2 text-zinc-300">{r.mentorId || '-'}</td>
                <td className="px-3 py-2 text-zinc-300">{ /* simple progress */ }{Math.round(((r.tasks.filter(t=> t.done).length) / (r.tasks.length||1))*100)}%</td>
                <td className="px-3 py-2 text-zinc-300">{r.status}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={()=> onView?.(r.id)} className="text-zinc-300 mr-2">View</button>
                  <button onClick={()=> setAssignOpen(r.id)} className="text-emerald-300 mr-2"><UserPlus className="inline h-4 w-4" /></button>
                  <button onClick={()=> { archiveOnboarding(r.id); showToast({ title: 'Archived', type: 'success' }); }} className="text-rose-400"><Trash2 className="inline h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-8 text-center text-zinc-400">No onboardings</td></tr>}
          </tbody>
        </table>
      </div>

      {assignOpen && <AssignMentorModal onboardingId={assignOpen} open={!!assignOpen} onClose={()=> setAssignOpen(null)} />}
    </div>
  );
}
