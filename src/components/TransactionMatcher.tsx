"use client";

import { motion } from "framer-motion";
import { useVat } from "@/store/useVat";

interface Props { open: boolean; onClose: () => void }

export function TransactionMatcher({ open, onClose }: Props) {
  const { transactions, matchTransaction } = useVat();
  if (!open) return null;
  const unmatched = transactions.filter(t => !t.matched);
  const matched = transactions.filter(t => t.matched);
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <motion.div className="modal-card max-w-5xl" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Transaction Matcher</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <h4 className="font-medium mb-1">Unmatched</h4>
            <div className="table-container">
              <table>
                <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th><th></th></tr></thead>
                <tbody>
                  {unmatched.map(u => (
                    <tr key={u.id}>
                      <td>{u.date.slice(0,10)}</td>
                      <td>{u.invoiceNumber}</td>
                      <td>{u.amount.toFixed(2)}</td>
                      <td><button className="btn-primary" onClick={() => matchTransaction(u.id)}>Mark Matched</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-1">Matched</h4>
            <div className="table-container">
              <table>
                <thead><tr><th>Date</th><th>Invoice</th><th>Amount</th></tr></thead>
                <tbody>
                  {matched.map(m => (
                    <tr key={m.id}><td>{m.date.slice(0,10)}</td><td>{m.invoiceNumber}</td><td>{m.amount.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
