"use client";

import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="relative flex-1">
      <input className="form-input w-full pr-10" placeholder="Search by ID, title, or asset..." value={q} onChange={(e)=>{ setQ(e.target.value); onSearch(e.target.value); }} />
      {q && (<button className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary" onClick={()=>{ setQ(""); onSearch(""); }}>✕</button>)}
    </div>
  );
}
