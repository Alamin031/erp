"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (info: { method: string; reference: string; date: string; amount: number }) => void;
}

export function ReimbursementForm({ open, onClose, onSubmit }: Props) {
  const [method, setMethod] = useState("Bank");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState<number | "">("");
  const { showToast } = useToast();

  if (!open) return null;

  const handle = () => {
    if (!reference || !amount) return showToast("Please fill required fields", "error");
    onSubmit({ method, reference, date, amount: Number(amount) });
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card">
        <div className="modal-header"><h2>Mark as Reimbursed</h2></div>
        <div className="modal-form">
          <div className="grid grid-cols-1 gap-2">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-input"><option>Bank</option><option>Cash</option><option>Payroll</option></select>
            <input className="form-input" placeholder="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="number" className="form-input" placeholder="Amount" value={amount as any} onChange={(e) => setAmount(Number(e.target.value))} />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handle}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
