"use client";

import { Expense } from "@/types/expenses";

interface Props { items: Expense[] }

export function CSVExportButton({ items }: Props) {
  const exportCSV = () => {
    const headers = ["id","title","category","amount","currency","date","vendor","project","billable","notes","status"];
    const rows = items.map((i) => headers.map((h)=>JSON.stringify((i as any)[h] ?? "")).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'expenses_export.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return <button className="btn btn-secondary" onClick={exportCSV}>Export CSV</button>;
}
