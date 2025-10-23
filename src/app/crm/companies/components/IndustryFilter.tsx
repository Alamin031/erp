"use client";

import { useCompanies } from '@/store/useCompanies';
import { useState } from 'react';

export function IndustryFilter() {
  const { industries, filters, setFilters } = useCompanies();
  const [q, setQ] = useState('');
  const filtered = industries.filter(i => i.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
      <input className="form-input" placeholder="Search industries..." value={q} onChange={(e)=>setQ(e.target.value)} />
      <select className="form-input" value={filters.industry || 'All'} onChange={(e)=>setFilters({...filters, industry: e.target.value})}>
        <option value="All">All Industries</option>
        {filtered.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
      </select>
    </div>
  );
}
