"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

export function ExportScheduleMenu() {
  const [open, setOpen] = useState(false);

  function exportCSV() {
    const a = document.createElement('a');
    a.href = '/demo/schedule_template.csv';
    a.download = 'schedule_export.csv';
    a.click();
    setOpen(false);
  }

  return (
    <div className="relative">
      <button onClick={()=> setOpen(s => !s)} className="px-3 py-2 rounded-xl bg-slate-800 text-zinc-100 border border-zinc-700">Export</button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg bg-zinc-900 border border-zinc-700 p-2 shadow-lg">
          <button onClick={exportCSV} className="w-full text-left px-2 py-2 hover:bg-zinc-800 rounded">Export CSV</button>
          <button onClick={()=> alert('PDF export placeholder')} className="w-full text-left px-2 py-2 hover:bg-zinc-800 rounded">Export PDF</button>
          <button onClick={()=> alert('Share placeholder')} className="w-full text-left px-2 py-2 hover:bg-zinc-800 rounded">Share to Department</button>
        </div>
      )}
    </div>
  );
}
