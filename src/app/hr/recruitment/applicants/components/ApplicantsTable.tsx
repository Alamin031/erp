"use client";

import { useMemo, useState } from 'react';
import { useApplicants } from '../store/useApplicants';
import { useJobs } from '../../jobs/store/useJobs';
import { Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/toast';

export function ApplicantsTable({ onRowClick }: { onRowClick?: (id: string) => void }) {
  const { applicants, deleteApplicant, updateApplicant } = useApplicants();
  const { jobs } = useJobs();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => applicants, [applicants]);

  function toggle(id: string) { setSelected(s => s.includes(id) ? s.filter(x=> x!==id) : [...s, id]); }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2"><input type="checkbox" onChange={(e)=> setSelected(e.target.checked ? rows.map(r=> r.id) : [])} checked={selected.length === rows.length && rows.length>0} aria-label="select all" /></th>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Job Applied</th>
            <th className="px-3 py-2 text-left">Recruiter</th>
            <th className="px-3 py-2 text-left">Stage</th>
            <th className="px-3 py-2 text-left">Applied On</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer" onClick={(e)=> { if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') onRowClick?.(r.id); }}>
              <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(r.id)} onChange={()=> toggle(r.id)} aria-label={`select-${r.id}`} /></td>
              <td className="px-3 py-2 text-zinc-200">{r.id}</td>
              <td className="px-3 py-2 text-zinc-100">{r.name}</td>
              <td className="px-3 py-2 text-zinc-300">{jobs.find(j=> j.id === r.jobId)?.title || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{r.recruiterId || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{r.stage}</td>
              <td className="px-3 py-2 text-zinc-300">{r.appliedDate || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{r.status}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={(e)=> { e.stopPropagation(); updateApplicant(r.id, { stage: 'shortlisted' }); showToast('Shortlisted'); }} className="text-amber-400 hover:text-amber-300 mr-3">Shortlist</button>
                <button onClick={(e)=> { e.stopPropagation(); deleteApplicant(r.id); showToast('Applicant deleted'); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="inline h-4 w-4" /></button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={9} className="px-3 py-8 text-center text-zinc-400">No applicants found</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
