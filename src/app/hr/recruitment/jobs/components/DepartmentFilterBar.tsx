"use client";

import { useEffect, useState } from 'react';
import { useJobs } from '../store/useJobs';

export function DepartmentFilterBar() {
  const { filterJobs } = useJobs();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(name: string) {
    setSelected(s => s.includes(name) ? s.filter(x=> x!==name) : [...s, name]);
  }

  useEffect(()=> { filterJobs({ departments: selected }); }, [selected]);

  return (
    <div className="flex items-center gap-2">
      <button onClick={()=> setSelected([])} className="px-2 py-1 rounded-xl bg-zinc-800 text-zinc-100">All Depts</button>
      <button onClick={()=> toggle('Engineering')} className={`px-2 py-1 rounded-xl ${selected.includes('Engineering') ? 'bg-violet-500 text-black' : 'bg-zinc-800 text-zinc-100'}`}>Engineering</button>
      <button onClick={()=> toggle('Data')} className={`px-2 py-1 rounded-xl ${selected.includes('Data') ? 'bg-violet-500 text-black' : 'bg-zinc-800 text-zinc-100'}`}>Data</button>
      <button onClick={()=> toggle('Design')} className={`px-2 py-1 rounded-xl ${selected.includes('Design') ? 'bg-violet-500 text-black' : 'bg-zinc-800 text-zinc-100'}`}>Design</button>
    </div>
  );
}
