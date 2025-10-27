"use client";

import { useMemo } from 'react';
import { useInterviews } from '../store/useInterviews';

export function InterviewsCalendar({ onEventClick }: { onEventClick?: (id: string) => void }) {
  const { interviews } = useInterviews();

  const days = useMemo(()=> interviews.slice(0,14), [interviews]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-zinc-400">Week / Month toggle placeholder</div>
        <div className="text-zinc-400 text-sm">Calendar view (placeholder)</div>
      </div>

      <div className="rounded-xl bg-slate-900/40 border border-slate-800 p-4 min-h-[300px]">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, idx)=> (
            <div key={idx} className="p-2 bg-zinc-900/50 rounded">
              <div className="text-zinc-300 text-xs mb-2">Day {idx+1}</div>
              {days.slice(idx, idx+3).map(d => (
                <button key={d.id} onClick={()=> onEventClick?.(d.id)} className="w-full text-left mb-2 p-2 rounded bg-cyan-500/20 border border-cyan-500/10 text-cyan-100">{d.id} • {d.round}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
