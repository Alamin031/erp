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
    <div className="table-container">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Transaction Reconciliation</h2>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={onAutoMatch}>Auto-match</button>
          <button className="btn-secondary" onClick={onOpenMatcher}>Open Matcher</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Invoice</th>
            <th>Amount</th>
            <th>VAT</th>
            <th>VAT Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date.slice(0,10)}</td>
              <td>{tx.type}</td>
              <td>{tx.invoiceNumber}</td>
              <td>{tx.amount.toFixed(2)}</td>
              <td>{tx.vatAmount.toFixed(2)}</td>
              <td>{tx.vatCategory}</td>
              <td>{tx.matched ? <span className="badge bg-green-100 text-green-700">Matched</span> : <span className="badge bg-yellow-100 text-yellow-800">Unmatched</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
