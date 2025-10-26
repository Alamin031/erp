"use client";

import { useMemo } from "react";
import { useVat } from "@/store/useVat";

interface Props {
  onCreateReturn: () => void;
  onReconcile: () => void;
  onUpload: () => void;
  onExport: () => void;
}

export function VatDashboard({ onCreateReturn, onReconcile, onUpload, onExport }: Props) {
  const { vatReturns, transactions } = useVat();
  const kpis = useMemo(() => {
    const output = vatReturns.reduce((s, r) => s + r.outputVat, 0);
    const input = vatReturns.reduce((s, r) => s + r.inputVat, 0);
    const net = output - input;
    const nextDeadline = new Date();
    nextDeadline.setMonth(nextDeadline.getMonth() + 1, 15);
    return { output, input, net, deadline: nextDeadline.toISOString().slice(0,10) };
  }, [vatReturns, transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="stat-label">Total VAT Payable</div>
        <div className="stat-value text-red-600">{kpis.output.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total VAT Receivable</div>
        <div className="stat-value text-green-600">{kpis.input.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Net VAT Due</div>
        <div className="stat-value">{kpis.net.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Next Filing Deadline</div>
        <div className="stat-value">{kpis.deadline}</div>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <button className="btn-primary" onClick={onCreateReturn}>Create Return</button>
        <button className="btn-secondary" onClick={onReconcile}>Reconcile Transactions</button>
        <button className="btn-secondary" onClick={onUpload}>Upload Invoices</button>
        <button className="btn-secondary" onClick={onExport}>Export Return</button>
      </div>
    </div>
  );
}
