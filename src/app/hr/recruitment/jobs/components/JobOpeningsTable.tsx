"use client";

import { useMemo, useState } from 'react';
import { useJobs } from '../store/useJobs';
import { Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/components/toast';

export function JobOpeningsTable({ onRowClick }: { onRowClick?: (id: string) => void }) {
  const { jobs, recruiters, updateJob, deleteJob } = useJobs();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => jobs, [jobs]);

  function toggle(id: string) {
    setSelected(s => s.includes(id) ? s.filter(x=> x !== id) : [...s, id]);
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-zinc-400 text-xs">
          <tr>
            <th className="px-3 py-2"><input type="checkbox" onChange={(e)=> setSelected(e.target.checked ? rows.map(r=> r.id) : [])} checked={selected.length === rows.length && rows.length>0} aria-label="select all" /></th>
            <th className="px-3 py-2 text-left">Job ID</th>
            <th className="px-3 py-2 text-left">Title</th>
            <th className="px-3 py-2 text-left">Department</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-left">Recruiter</th>
            <th className="px-3 py-2 text-left">Posted On</th>
            <th className="px-3 py-2 text-left">Closing</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-right">Applicants</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(job => (
            <tr key={job.id} className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer" onClick={(e)=> { if ((e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'INPUT') onRowClick?.(job.id); }}>
              <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(job.id)} onChange={()=> toggle(job.id)} aria-label={`select-${job.id}`} /></td>
              <td className="px-3 py-2 text-zinc-200">{job.id}</td>
              <td className="px-3 py-2 text-zinc-100">{job.title}</td>
              <td className="px-3 py-2 text-zinc-300">{job.department}</td>
              <td className="px-3 py-2 text-zinc-300">{job.employmentType}</td>
              <td className="px-3 py-2 text-zinc-300">{recruiters.find(r=> r.id === job.recruiterId)?.name || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{job.postingDate || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{job.closingDate || '-'}</td>
              <td className="px-3 py-2 text-zinc-300">{job.status}</td>
              <td className="px-3 py-2 text-right text-zinc-200">{job.applicants || 0}</td>
              <td className="px-3 py-2 text-right">
                <button onClick={(e)=> { e.stopPropagation(); updateJob(job.id, { status: 'closed' }); showToast('Job closed'); }} className="text-amber-400 hover:text-amber-300 mr-3">Close</button>
                <button onClick={(e)=> { e.stopPropagation(); deleteJob(job.id); showToast('Job deleted'); }} className="text-rose-400 hover:text-rose-300"><Trash2 className="inline h-4 w-4" /></button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={11} className="px-3 py-8 text-center text-zinc-400">No jobs found</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
