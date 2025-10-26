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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto bg-[#18181b] rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700"
        initial={{ opacity: 0, scale: .98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
          <h3 className="text-xl font-bold text-gray-100">Transaction Matcher</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold px-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Unmatched</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[#23232a]">
              <table className="min-w-full text-sm text-left text-gray-200">
                <thead className="bg-[#23232a] text-gray-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Invoice</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {unmatched.map(u => (
                    <tr key={u.id} className="border-t border-gray-700 hover:bg-[#23232a]/80">
                      <td className="px-4 py-2">{u.date.slice(0,10)}</td>
                      <td className="px-4 py-2">{u.invoiceNumber}</td>
                      <td className="px-4 py-2">{u.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => matchTransaction(u.id)}
                        >
                          Mark Matched
                        </button>
                      </td>
                    </tr>
                  ))}
                  {unmatched.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">All transactions matched</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-2">Matched</h4>
            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-[#23232a]">
              <table className="min-w-full text-sm text-left text-gray-200">
                <thead className="bg-[#23232a] text-gray-400">
                  <tr>
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium">Invoice</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {matched.map(m => (
                    <tr key={m.id} className="border-t border-gray-700 hover:bg-[#23232a]/80">
                      <td className="px-4 py-2">{m.date.slice(0,10)}</td>
                      <td className="px-4 py-2">{m.invoiceNumber}</td>
                      <td className="px-4 py-2">{m.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  {matched.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-500">No matched transactions</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
