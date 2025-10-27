"use client";

import { useState } from "react";
import { usePlanning } from "@/store/usePlanning";
import { motion } from "framer-motion";

export function EmployeeScheduleCalendar() {
  const { shifts, employees } = usePlanning();
  const [mode, setMode] = useState<'week'|'month'>('week');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={()=> setMode('week')} className={`px-3 py-1 rounded-xl ${mode==='week' ? 'bg-indigo-500 text-black' : 'bg-slate-800 text-slate-200'}`}>Week</button>
          <button onClick={()=> setMode('month')} className={`px-3 py-1 rounded-xl ${mode==='month' ? 'bg-indigo-500 text-black' : 'bg-slate-800 text-slate-200'}`}>Month</button>
        </div>
        <div className="text-slate-400 text-sm">Showing {mode} view</div>
      </div>

      <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-4 min-h-[200px]">
        <motion.div layout className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-2 bg-slate-800/50 rounded">
              <div className="text-slate-300 text-xs mb-2">Day {i+1}</div>
              <div className="space-y-2">
                {shifts.slice(0,5).map(s => (
                  <div key={s.id} className="rounded-lg bg-indigo-600/80 p-2 text-xs text-black">{s.startTime}-{s.endTime} • {s.role || 'Shift'}</div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
