"use client";

import { useRef } from "react";

export function UploadVatInvoice() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="inline-flex items-center gap-2">
      <input ref={inputRef} type="file" accept="application/pdf,image/*" className="hidden" multiple onChange={() => {/* handle preview later */}} />
      <button className="btn-secondary" onClick={() => inputRef.current?.click()}>Upload Invoices</button>
      <span className="text-xs text-gray-500">PDF/JPG/PNG up to 10MB</span>
    </div>
  );
}
