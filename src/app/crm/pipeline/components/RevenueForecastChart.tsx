"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { usePipeline } from '@/store/usePipeline';

export function RevenueForecastChart() {
  const { opportunities } = usePipeline();
  // group by month
  const map: Record<string, number> = {};
  opportunities.forEach(o=>{
    const month = (o.expectedCloseDate || o.createdAt || '').slice(0,7) || 'unknown';
    map[month] = (map[month]||0) + ((o.value||0) * ((o.probability||50)/100));
  });
  const data = Object.entries(map).sort(([a],[b])=>a.localeCompare(b)).map(([month,value])=>({ month, value }));

  return (
    <div style={{ height: 180 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
