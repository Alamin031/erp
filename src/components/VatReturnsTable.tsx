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
    <div className="w-full bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">VAT Returns</h2>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={onCreate}>New Return</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-200">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-4 py-2 font-semibold">Period</th>
              <th className="px-4 py-2 font-semibold">Output VAT</th>
              <th className="px-4 py-2 font-semibold">Input VAT</th>
              <th className="px-4 py-2 font-semibold">Net</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900 hover:bg-gray-800/60 transition"}>
                <td className="px-4 py-2 whitespace-nowrap">{r.periodStart} <span className="text-gray-500">→</span> {r.periodEnd}</td>
                <td className="px-4 py-2">{r.outputVat.toFixed(2)}</td>
                <td className="px-4 py-2">{r.inputVat.toFixed(2)}</td>
                <td className={`px-4 py-2 font-semibold ${r.outputVat - r.inputVat < 0 ? 'text-red-400' : 'text-green-400'}`}>{(r.outputVat - r.inputVat).toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${r.status === 'Filed' ? 'bg-green-200 text-green-800' : r.status === 'Draft' || r.status === 'Ready' ? 'bg-yellow-200 text-yellow-900' : 'bg-red-200 text-red-800'}`}>{r.status}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-2 py-1 rounded bg-gray-800 hover:bg-blue-700 text-blue-300 hover:text-white transition" onClick={() => onView(r.id)}>View</button>
                    <button className="px-2 py-1 rounded bg-gray-800 hover:bg-yellow-600 text-yellow-300 hover:text-white transition" onClick={() => onEdit(r.id)}>Edit</button>
                    <button className="px-2 py-1 rounded bg-gray-800 hover:bg-green-700 text-green-300 hover:text-white transition" onClick={() => onExport(r.id, 'csv')}>CSV</button>
                    <button className="px-2 py-1 rounded bg-gray-800 hover:bg-red-700 text-red-300 hover:text-white transition" onClick={() => onExport(r.id, 'pdf')}>PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
