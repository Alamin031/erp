import React from "react";

export function CsvImportButton({ onImport }: { onImport?: () => void }) {
  return (
    <button
      type="button"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={onImport}
    >
      Import CSV
    </button>
  );
}
