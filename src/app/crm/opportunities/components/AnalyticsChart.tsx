"use client";

import { Opportunity } from '@/types/opportunities';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface Props { opportunities: Opportunity[] }

export function AnalyticsChart({ opportunities }: Props) {
  const byStage: Record<string, number> = {};
  const revenueByMonth: Record<string, number> = {};
  let won = 0, lost = 0;

  opportunities.forEach(o=>{
    byStage[o.stage] = (byStage[o.stage]||0)+1;
    const month = o.expectedCloseDate ? o.expectedCloseDate.slice(0,7) : o.createdAt.slice(0,7);
    revenueByMonth[month] = (revenueByMonth[month]||0) + (o.value||0);
    if (o.stage === 'Closed Won') won++; if (o.stage === 'Closed Lost') lost++;
  });

  const stageData = Object.entries(byStage).map(([name,value])=>({ name, value }));
  const growthData = Object.entries(revenueByMonth).sort().map(([month, value])=>({ month, value }));
  const pieData = [{ name: 'Won', value: won }, { name: 'Lost', value: lost }];
  const COLORS = ['#059669','#dc3545'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60} label>
              {pieData.map((entry, idx)=>(<Cell key={entry.name} fill={COLORS[idx%COLORS.length]} />))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
