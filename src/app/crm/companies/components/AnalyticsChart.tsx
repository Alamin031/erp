"use client";

import { Company } from '@/types/companies';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LineChart, Line } from 'recharts';

interface Props { companies: Company[] }

export function AnalyticsChart({ companies }: Props) {
  const byIndustryMap: Record<string, number> = {};
  const byCountryMap: Record<string, number> = {};
  const growthMap: Record<string, number> = {};

  companies.forEach(c => {
    byIndustryMap[c.industry || 'Unknown'] = (byIndustryMap[c.industry || 'Unknown'] || 0) + 1;
    byCountryMap[c.country || 'Unknown'] = (byCountryMap[c.country || 'Unknown'] || 0) + 1;

    // Guard against missing/invalid dates
    if (c.createdAt) {
      const d = new Date(c.createdAt);
      if (!isNaN(d.getTime())) {
        const month = d.toISOString().slice(0, 7);
        growthMap[month] = (growthMap[month] || 0) + 1;
      } else {
        // collect under 'Unknown' month to avoid crashing
        growthMap['unknown'] = (growthMap['unknown'] || 0) + 1;
      }
    } else {
      growthMap['unknown'] = (growthMap['unknown'] || 0) + 1;
    }
  });

  const byIndustry = Object.entries(byIndustryMap).map(([name,value])=>({ name, value }));
  const byCountry = Object.entries(byCountryMap).map(([name,value])=>({ name, value }));
  const growth = Object.entries(growthMap).sort().map(([month, value])=>({ month, value }));
  const COLORS = ['#059669','#2563eb','#f59e0b','#8b5cf6','#dc3545'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={byIndustry} dataKey="value" nameKey="name" outerRadius={60} label>
              {byIndustry.map((e,i)=>(<Cell key={e.name} fill={COLORS[i%COLORS.length]} />))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byCountry}>
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
          <LineChart data={growth}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
