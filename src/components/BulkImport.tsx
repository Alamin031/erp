"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";

interface Props { onImport: (rows: any[]) => void }

export function BulkImport({ onImport }: Props) {
  const [preview, setPreview] = useState<any[]>([]);
  const { showToast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map((ln) => {
        const cols = ln.split(',');
        const obj: any = {};
        headers.forEach((h, i) => obj[h.trim()] = cols[i]?.trim());
        return obj;
      });
      setPreview(rows.slice(0, 5));
    };
    reader.readAsText(f);
  };

  return (
    <div className="rounded-xl p-4 border border-gray-700 bg-gray-900">
  <h4 className="font-semibold text-gray-100">Bulk Import (CSV)</h4>
  <input type="file" accept=".csv" onChange={handleFile} className="bg-gray-900 text-gray-100 border-gray-700 rounded" />
      {preview.length > 0 && (
        <div className="mt-3">
          <h5 className="font-medium text-gray-100">Preview</h5>
          <pre className="text-xs max-h-40 overflow-auto bg-gray-800 text-gray-100 p-2 rounded">{JSON.stringify(preview, null, 2)}</pre>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-secondary" onClick={() => setPreview([])}>Clear</button>
            <button className="btn btn-primary" onClick={() => { onImport(preview); showToast("Imported", "success"); }}>Import</button>
          </div>
        </div>
      )}
    </div>
  );
}
