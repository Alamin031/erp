"use client";

import { parseCsv } from "@/lib/vatImport";
import { useVat } from "@/store/useVat";
import { useRef, useState } from "react";

export function CsvImportButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { importTransactions } = useVat();
  const [errors, setErrors] = useState<string | null>(null);
  return (
    <div className="inline-flex items-center gap-2">
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const res = await parseCsv(file);
        if (res.errors.length) { setErrors(res.errors.map(e=>`Row ${e.row}: ${e.message}`).join('\n')); return; }
        importTransactions(res.rows as any);
      }} />
      <button className="btn-secondary" onClick={() => inputRef.current?.click()}>Import CSV</button>
      {errors && <span className="text-xs text-red-600">{errors}</span>}
    </div>
  );
}
