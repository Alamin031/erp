"use client";

import { useVat } from "@/store/useVat";

interface Props {
  returnId?: string;
  onAutoMatch: () => void;
  onOpenMatcher: () => void;
}

export function VatReconciliation({ returnId, onAutoMatch, onOpenMatcher }: Props) {
  const { transactions } = useVat();
  const items = transactions.slice(0, 20);
  return (
    <div className="w-full bg-gray-900 rounded-xl shadow-md border border-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Transaction Reconciliation</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-blue-700 hover:text-white transition" onClick={onAutoMatch}>Auto-match</button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-blue-700 hover:text-white transition" onClick={onOpenMatcher}>Open Matcher</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-200">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="px-4 py-2 font-semibold">Date</th>
              <th className="px-4 py-2 font-semibold">Type</th>
              <th className="px-4 py-2 font-semibold">Invoice</th>
              <th className="px-4 py-2 font-semibold">Amount</th>
              <th className="px-4 py-2 font-semibold">VAT</th>
              <th className="px-4 py-2 font-semibold">VAT Category</th>
              <th className="px-4 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((tx, idx) => (
              <tr key={tx.id} className={idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900 hover:bg-gray-800/60 transition"}>
                <td className="px-4 py-2 whitespace-nowrap">{tx.date.slice(0,10)}</td>
                <td className="px-4 py-2">{tx.type}</td>
                <td className="px-4 py-2">{tx.invoiceNumber}</td>
                <td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{tx.vatAmount.toFixed(2)}</td>
                <td className="px-4 py-2">{tx.vatCategory}</td>
                <td className="px-4 py-2">
                  {tx.matched ? (
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">Matched</span>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-200 text-yellow-900">Unmatched</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
