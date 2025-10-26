"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (bill: { vendorName: string; billNumber: string; amount: number; attachments: string[] }) => void;
}

export function UploadBillDrawer({ open, onClose, onSave }: Props) {
  const [vendorName, setVendorName] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleSave = () => {
    const attachments = files.map((f) => f.name);
    onSave({ vendorName, billNumber, amount: Number(amount), attachments });
    setVendorName("");
    setBillNumber("");
    setAmount(0);
    setFiles([]);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#181A20] shadow-2xl z-50 flex flex-col border-l border-gray-700 animate-slideIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2128]">
          <h2 className="text-lg font-semibold text-white">Upload Bill</h2>
          <button className="hover:bg-gray-800 rounded-full p-1 transition" onClick={onClose} aria-label="Close"><X size={22} className="text-gray-300" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Vendor *</label>
            <input
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="Vendor name"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Bill No *</label>
            <input
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="BILL-2024-XXX"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Amount *</label>
            <input
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Attachment</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center bg-gray-800">
              <Upload className="mx-auto mb-2 text-gray-400" />
              <input type="file" multiple onChange={handleFileChange} className="block mx-auto mt-2 text-sm text-gray-300" />
            </div>
            {files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-400 list-disc list-inside pl-4">
                {files.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 px-6 py-4 border-t border-gray-700 bg-[#1F2128] justify-end">
          <button className="btn btn-secondary w-full sm:w-auto" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary w-full sm:w-auto" onClick={handleSave}>Save & Close</button>
        </div>
      </div>
    </>
  );
}
