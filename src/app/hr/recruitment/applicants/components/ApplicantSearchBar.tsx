"use client";

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function ApplicantSearchBar() {
  const [q, setQ] = useState('');

  useEffect(()=>{
    const id = setTimeout(()=> {
      // placeholder debounce effect — integrate with store filter
    }, 300);
    return ()=> clearTimeout(id);
  },[q]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" />
      <input value={q} onChange={e=> setQ(e.target.value)} placeholder="Search by name, email or job..." className="pl-8 pr-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100" />
    </div>
  );
}
