import { csvTransactionColumns } from "@/types/vat";

export interface CsvParseResult<T> { rows: T[]; errors: { row: number; message: string }[] }

export function parseCsv<T = any>(file: File): Promise<CsvParseResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return resolve({ rows: [], errors: [] });
      const header = splitCsvLine(lines[0]);
      const missing = csvTransactionColumns.filter(c => !header.includes(c));
      const errors: { row: number; message: string }[] = [];
      if (missing.length) errors.push({ row: 0, message: `Missing columns: ${missing.join(', ')}` });
      const rows: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = splitCsvLine(lines[i]);
        const row: any = {};
        header.forEach((h, idx) => row[h] = values[idx]);
        // basic coercion
        if (row.amount != null) row.amount = Number(row.amount);
        if (row.vatAmount != null) row.vatAmount = Number(row.vatAmount);
        rows.push(row);
      }
      resolve({ rows: rows as T[], errors });
    };
    reader.readAsText(file);
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map(v => v.trim());
}
