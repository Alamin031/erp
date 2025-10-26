"use client";

import { useState } from "react";

interface Props {
  onChange: (files: File[]) => void;
}

export function UploadReceipt({ onChange }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    onChange(list);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  return (
    <div>
      <label className="block text-sm font-medium">Receipts</label>
      <div className="border-2 border-dashed p-4 rounded mt-2 text-center">
        <input type="file" multiple onChange={handleFiles} />
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {previews.map((p) => <img key={p} src={p} className="w-20 h-20 object-cover rounded" alt="preview" />)}
        </div>
      </div>
    </div>
  );
}
