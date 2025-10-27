"use client";

import { useRef } from "react";
import { useSkills } from "@/store/useSkills";
import { useToast } from "@/components/toast";
import { Upload, Download, FileDown } from "lucide-react";

export function ImportExportControls() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { importCSV, exportCSV } = useSkills();
  const { showToast } = useToast();

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.name.endsWith('.csv')) { showToast('Invalid file type'); return; }
    if (f.size > 2 * 1024 * 1024) { showToast('File too large (max 2MB)'); return; }
    const res = await importCSV(f);
    if (!res.ok) {
      showToast(`Import completed with errors: ${res.imported} imported`);
    } else {
      showToast(`Import successful: ${res.imported} records imported`);
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  function downloadTemplate() {
    const a = document.createElement('a');
    a.href = '/demo/skills_import_template.csv';
    a.download = 'skills_import_template.csv';
    a.click();
  }

  function onExport() {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skills_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported');
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={downloadTemplate} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700">
        <FileDown className="h-4 w-4" /> Template
      </button>
      <button onClick={onExport} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700">
        <Download className="h-4 w-4" /> Export
      </button>
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 cursor-pointer">
        <Upload className="h-4 w-4" /> Import
        <input ref={inputRef} onChange={onFileChange} type="file" accept=".csv" className="sr-only" aria-label="Import CSV" />
      </label>
    </div>
  );
}
