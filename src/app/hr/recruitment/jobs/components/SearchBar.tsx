"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [q, setQ] = useState('');
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
      <input value={q} onChange={e=> setQ(e.target.value)} placeholder="Search jobs or recruiter..." className="pl-8 pr-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100" aria-label="Search jobs" />
    </div>
  );
}
