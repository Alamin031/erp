"use client";

import { Contact } from "@/types/contacts";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

interface Props { contacts: Contact[] }

export function SegmentAnalyticsChart({ contacts }: Props) {
  const byType = [
    { name: 'Customer', value: contacts.filter(c => c.type === 'Customer').length },
    { name: 'Prospect', value: contacts.filter(c => c.type === 'Prospect').length },
  ];

  const countryCounts: Record<string, number> = {};
  contacts.forEach(c => { const k = c.country || 'Unknown'; countryCounts[k] = (countryCounts[k] || 0) + 1; });
  const byCountry = Object.entries(countryCounts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({ name, value }));

  const tagCounts: Record<string, number> = {};
  contacts.forEach(c => c.tags.forEach(t => tagCounts[t] = (tagCounts[t]||0)+1));
  const byTag = Object.entries(tagCounts).map(([name,value])=>({ name, value }));

  const COLORS = ['#059669', '#2563eb', '#f59e0b', '#8b5cf6', '#dc3545'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={byType} dataKey="value" nameKey="name" outerRadius={60} label>
              {byType.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
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

      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byTag}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
