"use client";

import type { VatReturn } from "@/types/vat";

interface Props {
  returns: VatReturn[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onExport: (id: string, format: "csv" | "pdf") => void;
}

export function VatReturnsTable({ returns, onCreate, onEdit, onView, onExport }: Props) {
  return (
    <div className="table-container">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">VAT Returns</h2>
        <button className="btn-primary" onClick={onCreate}>New Return</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Output VAT</th>
            <th>Input VAT</th>
            <th>Net</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(r => (
            <tr key={r.id}>
              <td>{r.periodStart} → {r.periodEnd}</td>
              <td>{r.outputVat.toFixed(2)}</td>
              <td>{r.inputVat.toFixed(2)}</td>
              <td>{(r.outputVat - r.inputVat).toFixed(2)}</td>
              <td>
                <span className={`badge ${r.status === 'Filed' ? 'bg-green-100 text-green-700' : r.status === 'Draft' || r.status === 'Ready' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'}`}>{r.status}</span>
              </td>
              <td>
                <div className="table-actions">
                  <button onClick={() => onView(r.id)}>View</button>
                  <button onClick={() => onEdit(r.id)}>Edit</button>
                  <button onClick={() => onExport(r.id, 'csv')}>CSV</button>
                  <button onClick={() => onExport(r.id, 'pdf')}>PDF</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
