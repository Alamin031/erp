export function exportToCsv(data: any[], filename = 'export.csv') {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const rows = data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','));
  const csv = [keys.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
