"use client";

import { useState } from 'react';

export function FiltersBar() {
  const [q, setQ] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input value={q} onChange={e=> setQ(e.target.value)} placeholder="Search candidate or job..." className="pl-3 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100" />
      <select className="rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-zinc-100"><option value="">All Types</option><option>Phone</option><option>Video</option><option>Onsite</option></select>
    </div>
  );
}
