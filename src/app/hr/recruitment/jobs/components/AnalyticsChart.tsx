"use client";

import { useMemo } from 'react';
import { useJobs } from '../store/useJobs';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

export function AnalyticsChart() {
  const { jobs } = useJobs();
  const byDept = useMemo(() => {
    const map: Record<string, number> = {};
    jobs.forEach(j => { const d = j.department || 'Other'; map[d] = (map[d]||0) + 1; });
    return Object.entries(map).map(([name, value])=> ({ name, value }));
  }, [jobs]);

  const COLORS = ['#7c3aed','#34d399','#60a5fa','#f97316','#f43f5e'];

  if (!jobs.length) return null;

  return (
    <div className="w-48 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={byDept} dataKey="value" nameKey="name" innerRadius={20} outerRadius={40} fill="#8884d8">
            {byDept.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
