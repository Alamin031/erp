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
      <div className="slide-over-overlay" onClick={onClose} />
      <div className="slide-over">
        <div className="slide-over-header">
          <h2>Upload Bill</h2>
          <button className="slide-over-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="slide-over-content">
          <div className="form-group">
            <label className="form-label">Vendor *</label>
            <input className="form-input" value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="Vendor name" />
          </div>
          <div className="form-group">
            <label className="form-label">Bill No *</label>
            <input className="form-input" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} placeholder="BILL-2024-XXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Amount *</label>
            <input className="form-input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="0.00" />
          </div>
          <div className="form-group">
            <label className="form-label">Attachment</label>
            <div className="border-2 border-dashed border-gray-500 rounded-md p-4 text-center">
              <Upload className="mx-auto mb-2" />
              <input type="file" multiple onChange={handleFileChange} />
            </div>
            {files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-400 list-disc list-inside">
                {files.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="slide-over-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save & Close</button>
        </div>
      </div>
    </>
  );
}
