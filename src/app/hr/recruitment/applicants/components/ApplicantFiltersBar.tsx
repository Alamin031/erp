"use client";

import { useState, useEffect } from 'react';
import { useApplicants } from '../store/useApplicants';

export function ApplicantFiltersBar() {
  const { filterApplicants } = useApplicants();
  const [jobId, setJobId] = useState<string | null>(null);
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [stage, setStage] = useState<'all'|'applied'|'shortlisted'|'interview'|'hired'|'rejected'>('all');

  useEffect(()=> { filterApplicants({ jobId, recruiterId, stage }); }, [jobId, recruiterId, stage]);

  return (
    <div className="flex items-center gap-2">
      <select value={jobId||''} onChange={e=> setJobId(e.target.value||null)} className="rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2">
        <option value="">All Jobs</option>
        <option value="job-1">Frontend Engineer</option>
        <option value="job-2">Data Engineer</option>
      </select>

      <select value={recruiterId||''} onChange={e=> setRecruiterId(e.target.value||null)} className="rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2">
        <option value="">All Recruiters</option>
        <option value="r-1">Olivia Perez</option>
        <option value="r-2">Noah Brown</option>
      </select>

      <select value={stage} onChange={e=> setStage(e.target.value as any)} className="rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 px-3 py-2">
        <option value="all">All Stages</option>
        <option value="applied">Applied</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="interview">Interview</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      <button onClick={()=> { setJobId(null); setRecruiterId(null); setStage('all'); }} className="px-2 py-2 rounded-xl bg-zinc-800 text-zinc-100">Reset</button>
    </div>
  );
}
