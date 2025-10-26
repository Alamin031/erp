"use client";

interface Props { disabled?: boolean; onExport: () => void }
export function ExportPdfButton({ disabled, onExport }: Props) {
  return <button className="btn-secondary" disabled={disabled} onClick={onExport}>Export PDF</button>;
}
