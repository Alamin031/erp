import React from "react";

export function UploadVatInvoice({ onUpload }: { onUpload?: () => void }) {
  return (
    <button
      type="button"
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      onClick={onUpload}
    >
      Upload VAT Invoice
    </button>
  );
}
