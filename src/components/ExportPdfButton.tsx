import React from "react";

export function ExportPdfButton({ onExport }: { onExport?: () => void }) {
  return (
    <button
      type="button"
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      onClick={onExport}
    >
      Export PDF
    </button>
  );
}
