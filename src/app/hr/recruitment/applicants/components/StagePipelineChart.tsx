"use client";

import { useMemo } from 'react';
import { useApplicants } from '../store/useApplicants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function StagePipelineChart() {
  const { getStageStats, applicants } = useApplicants();
  const stats = getStageStats();

  const data = useMemo(() => {
    const map: Record<string, number> = { Applied: 0, Shortlisted: 0, Interview: 0, Hired: 0, Rejected: 0 };
    applicants.forEach(a => {
      if (a.stage === 'applied') map['Applied']++;
      if (a.stage === 'shortlisted') map['Shortlisted']++;
      if (a.stage === 'interview') map['Interview']++;
      if (a.stage === 'hired') map['Hired']++;
      if (a.stage === 'rejected') map['Rejected']++;
    });
    return Object.entries(map).map(([name, value])=> ({ name, value }));
  }, [applicants]);

  if (!data.length) return null;

  return (
    <div className="w-56 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="value" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
